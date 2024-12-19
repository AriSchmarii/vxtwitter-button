// ==UserScript==
// @name         vxtwitter button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to copy links with an embedded video next to the bookmark button. Only works on tweets that contain a video.
// @author       Schmari
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    function add_embed_button() {
        const tweet_containers = document.querySelectorAll('article');

        tweet_containers.forEach((tweet) => {
            const video_element = tweet.querySelector('video');

            if (video_element && !tweet.querySelector('.ve-button')) {
                const bookmark_button = tweet.querySelector('[data-testid="bookmark"]');

                if (bookmark_button) {
                    const ve_button = document.createElement('button');
                    ve_button.classList.add('ve-button');
                    ve_button.style.marginLeft = '10px';
                    ve_button.style.backgroundColor = 'transparent';
                    ve_button.style.border = 'none';
                    ve_button.style.color = 'white';
                    ve_button.style.padding = '5px';
                    ve_button.style.cursor = 'pointer';
                    ve_button.style.fontSize = '16px';
                    ve_button.style.borderRadius = '50%';
                    ve_button.style.display = 'flex';
                    ve_button.style.alignItems = 'center';
                    ve_button.style.justifyContent = 'center';
                    ve_button.style.height = '40px';
                    ve_button.style.width = '40px';

                    // yoinked from https://www.svgrepo.com/svg/387253/copy-one
                    const svg_icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg_icon.setAttribute("viewBox", "0 0 48 48");
                    svg_icon.setAttribute("fill", "none");
                    svg_icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svg_icon.setAttribute("width", "23");
                    svg_icon.setAttribute("height", "23");

					const path_1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
					path_1.setAttribute("d", "M13 38H41V16L30 4H13V38Z");
					path_1.setAttribute("stroke", "#777C81");
					path_1.setAttribute("stroke-width", "3");
					path_1.setAttribute("stroke-linecap", "round");
					path_1.setAttribute("stroke-linejoin", "round");
					svg_icon.appendChild(path_1);

					const path_2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
					path_2.setAttribute("d", "M30 4V16H41");
					path_2.setAttribute("stroke", "#777C81");
					path_2.setAttribute("stroke-width", "3");
					path_2.setAttribute("stroke-linecap", "round");
					path_2.setAttribute("stroke-linejoin", "round");
					svg_icon.appendChild(path_2);

					const path_3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
					path_3.setAttribute("d", "M7 20V44H28");
					path_3.setAttribute("stroke", "#777C81");
					path_3.setAttribute("stroke-width", "3");
					path_3.setAttribute("stroke-linecap", "round");
					path_3.setAttribute("stroke-linejoin", "round");
					svg_icon.appendChild(path_3);

					const path_4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
					path_4.setAttribute("d", "M19 20H23");
					path_4.setAttribute("stroke", "#777C81");
					path_4.setAttribute("stroke-width", "3");
					path_4.setAttribute("stroke-linecap", "round");
					svg_icon.appendChild(path_4);

					const path_5 = document.createElementNS("http://www.w3.org/2000/svg", "path");
					path_5.setAttribute("d", "M19 28H31");
					path_5.setAttribute("stroke", "#777C81");
					path_5.setAttribute("stroke-width", "3");
                    path_5.setAttribute("stroke-linecap", "round");
                    svg_icon.appendChild(path_5);

                    ve_button.appendChild(svg_icon);

                    bookmark_button.parentNode.appendChild(ve_button);

                    const tweet_link = tweet.querySelector('a[href*="/status/"]');
                    let tweet_url = tweet_link ? `https://x.com${tweet_link.getAttribute('href')}` : '';

                    tweet_url = tweet_url.replace('x.com', 'vxtwitter.com');

                    ve_button.addEventListener('click', function() {
                        if (tweet_url) {
                            navigator.clipboard.writeText(tweet_url).then(() => {
                                show_toast('Embedded video link copied to clipboard!');
                            }).catch((err) => {
                                console.error('Failed to copy video link: ', err);
                            });
                        } else {
                            console.error('Link not found :c');
                        }
                    });
                }
            }
        });
    }

    function show_toast(message) {
		const toast = document.createElement('div');
		toast.classList.add('toast');
		toast.textContent = message;

		toast.style.position = 'fixed';
		toast.style.bottom = '40px';
		toast.style.left = '50%';
		toast.style.transform = 'translateX(-50%)';
		toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
		toast.style.color = 'white';
		toast.style.padding = '10px 20px';
		toast.style.borderRadius = '5px';
		toast.style.fontSize = '14px';
		toast.style.fontFamily = 'Helvetica, Arial, sans-serif';
		toast.style.zIndex = '1000';
		toast.style.opacity = '0';
		toast.style.transition = 'opacity 0.3s ease';
		toast.style.border = '2px solid transparent';
		toast.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), linear-gradient(90deg, rgba(123, 94, 255, 1), rgba(40, 159, 255, 1))';
		toast.style.backgroundOrigin = 'border-box';
		toast.style.backgroundClip = 'padding-box, border-box';

		document.body.appendChild(toast);

		setTimeout(() => { toast.style.opacity = '1'; }, 10);

		setTimeout(() => {
			toast.style.opacity = '0';
			setTimeout(() => { toast.remove(); }, 300);
		}, 3000);
	}

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                add_embed_button();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    add_embed_button();

    GM_addStyle(`
		.ve-button {
			position: relative;
		}

		.ve-button:hover {
			background-color: rgba(40, 159, 255, 0.2);
		}

		.ve-button svg circle {
			fill: transparent;
			transition: fill 0.3s ease;
		}

		.ve-button:hover svg path {
			stroke: #289FEE;
		}

		.ve-button:hover::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(40, 159, 255, 0.14);
			border-radius: 50%;
		}

		.ve-button:hover svg circle {
			fill: rgba(79, 190, 255, 0.3);
		}
    `);
})();
