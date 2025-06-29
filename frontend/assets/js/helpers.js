import $ from 'jquery';

function setFavicon(url) {
    let $link = $("link[rel~='icon']");
    if ($link.length === 0) {
        $link = $("<link>", { rel: "icon" }).appendTo("head");
    }
    $link.attr("href", url);
}

function setTitle(title) {
    const appName = import.meta.env.VITE_APP_NAME || 'My App';

    if (title) {
        const fullTitle = `${title} | ${appName}`;
        $("title").length
            ? $("title").text(fullTitle)
            : $("<title>").text(fullTitle).appendTo("head");
    } else {
        let currentTitle = $("title").text().trim();
        if (currentTitle && !currentTitle.includes(appName)) {
            $("title").text(`${currentTitle} | ${appName}`);
        }
    }
}

export {
    setFavicon,
    setTitle
}