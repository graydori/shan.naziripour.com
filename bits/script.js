window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "UA-34564934-1");

Vue.directive("lazyload", {
    inserted: (el) => {
        function loadImage() {
            const imageElement = Array.from(el.children).find(
                (el) => el.nodeName === "IMG"
            );
            if (imageElement) {
                imageElement.addEventListener("load", () => {
                    setTimeout(() => el.classList.add("loaded"), 100);
                });
                imageElement.addEventListener("error", () =>
                    console.log("error")
                );
                imageElement.src = imageElement.dataset.url;
            }
        }

        function handleIntersect(entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadImage();
                    observer.unobserve(el);
                }
            });
        }

        function createObserver() {
            const options = {
                root: null,
                threshold: "0",
            };
            const observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(el);
        }
        if (window["IntersectionObserver"]) {
            createObserver();
        } else {
            loadImage();
        }
    },
});
Vue.component("figure-image", {
    props: ["figureId", "fileType"],
    computed: {
        alt: function () {
            return `Bits Comic: Number ${this.figureId}`;
        },
        source: function () {
            return `img/${("0000" + this.figureId).slice(-4)}.${this.fileType}`;
        },
    },
    template: `<div v-lazyload class="img-wrapper"><img :data-url="source" :alt="alt" /></div>`,
});
Vue.component("figure-time", {
    props: ["title", "datetime"],
    template: `<time v-bind:title="title" v-bind:datetime="datetime" >{{title}}</time>`,
});
Vue.component("figure-caption", {
    props: ["figureId"],
    data: function () {
        return {
            editMode: false,
            value: null,
        };
    },
    computed: {
        link: function () {
            if (!this.value) {
                return "#";
            }
            const subject = encodeURIComponent(
                `Bits Caption for ${this.figureId}`
            );
            const body = encodeURIComponent(this.value);
            return `mailto:shan@naziripour.com?subject=${subject}&body=${body}`;
        },
    },
    methods: {
        edit: function () {
            gtag("event", "bit_edit", {
                event_category: `Bits:${this.figureId}`,
                event_label: "Edit",
            });
            this.editMode = true;

            // Focus the component, but we have to wait
            // so that it will be showing first.
            Vue.nextTick(
                function () {
                    // DOM updated
                    this.$refs.body.focus();
                }.bind(this)
            );
        },
        send: function () {
            gtag("event", "bit_send", {
                event_category: `Bits:${this.figureId}`,
                event_label: this.value,
            });
            this.editMode = false;
        },
        cancel: function () {
            gtag("event", "bit_cancel", {
                event_category: `Bits:${this.figureId}`,
                event_label: "Cancel",
            });
            this.value = null;
            this.editMode = false;
        },
    },
    template: `<figcaption>
        <div class="form" v-if="editMode">
          <textarea ref="body" v-model="value" placeholder="Your Caption" />
          <a class="button" v-on:click="send" v-bind:disabled="!value" v-bind:href="link" target="_blank" title="Send your caption to me!">✉️ Send</a>
          <button class="button" type="button" v-on:click="cancel" >Cancel</button>
        </div>
        <div v-else>
            <span v-if="value">
              {{value}}
            </span>
            <span v-else>
              <slot></slot>
            </span>
            <button v-on:click="edit" title="Edit">✐</button>
            <i v-if="value">(edited)</i>
        </div>
      </figcaption>`,
});
const max = document.getElementById("comics").childElementCount - 1;
const current = location.hash ? window.location.hash.substring(1) : max;
var app = new Vue({
    el: "#app",
    data: {
        current,
        max,
        min: 0,
        showInfo: false,
        showShare: false,
        copied: false,
    },
    computed: {
        shareUrl: function () {
            ga("send", "event", "Videos", "play", "Fall Campaign");
            return `${location.href.split("#")[0]}#${this.current}`;
        },
        twitterUrl: function () {
            return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                this.shareUrl
            )}`;
        },
        facebookUrl: function () {
            return `http://www.facebook.com/sharer.php?u=${encodeURIComponent(
                this.shareUrl
            )}`;
        },
        linkedinUrl: function () {
            return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                this.shareUrl
            )}`;
        },
    },
    methods: {
        copy: function ({ target }) {
            gtag("event", "bit_copy", {
                event_category: `Bits:${this.current}`,
                event_label: "Copy",
            });
            /* Select the text field */
            target.select();
            target.setSelectionRange(0, 99999); /* For mobile devices */

            /* Copy the text inside the text field */
            document.execCommand("copy");
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
            }, 700);
        },
        newer: function () {
            gtag("event", "bit_newer", {
                event_category: `Bits:${this.current}`,
                event_label: "Newer",
            });
            location.hash = this.current = this.current + 1;
        },
        older: function () {
            gtag("event", "bit_older", {
                event_category: `Bits:${this.current}`,
                event_label: "Older",
            });
            location.hash = this.current = this.current - 1;
        },
        first: function () {
            gtag("event", "bit_first", {
                event_category: `Bits:${this.current}`,
                event_label: "First",
            });
            location.hash = this.current = this.min;
        },
        last: function () {
            gtag("event", "bit_last", {
                event_category: `Bits:${this.current}`,
                event_label: "Last",
            });
            location.hash = this.current = this.max;
        },
        cancelShare: function () {
            gtag("event", "bit_cancel_share", {
                event_category: `Bits:${this.current}`,
                event_label: "Cancel",
            });
            this.showShare = false;
        },
        share: function () {
            const canShare = navigator && navigator.share !== undefined;
            gtag("event", "bit_share", {
                event_category: `Bits:${this.current}`,
                event_label: "Share",
                event_value: canShare,
            });
            if (canShare) {
                navigator
                    .share({
                        url: this.shareUrl,
                    })
                    .then(() => console.log("Successful share"))
                    .catch((error) => console.log("Error sharing:", error));
            } else {
                this.showShare = true;
            }
        },
        cancelInfo: function () {
            gtag("event", "bit_cancel_info", {
                event_category: `Bits:${this.current}`,
                event_label: "Info",
            });
            this.showInfo = false;
        },
        info: function () {
            gtag("event", "bit_info", {
                event_category: `Bits:${this.current}`,
                event_label: "Info",
            });
            this.showInfo = true;
        },
    },
});