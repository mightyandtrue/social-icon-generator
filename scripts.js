// load icons on page
// icons variable set in icons.js
for ( icon of icons ) {
    var id = icon.name.replace(' ', '-');
    var element = `
        <div class="icon-wrapper" data-style="${icon.style}">
            <div id="${id}" class="icon-svg">
                ${icon.svg}
            </div>

            <div class="icon-name">
                ${icon.name}
            </div>

            <div class="download-buttons full-width">
                <a class="download-svg" data-icon="${id}" download="${id}.svg">SVG</a>
                <a class="download-png" data-icon="${id}" download="${id}.png">PNG</a>
                <a class="download-html" data-icon="${id}" download="${id}.html">HTML</a>
                <canvas id="${id}-canvas"></canvas>
            </div>
        </div>
    `;

    $('#social-icons').append(element);
}



// add main color picker
var pickr = Pickr.create({
    el: '#color-picker-inner-wrapper',
    theme: 'nano',

    components: {
        // Main components
        preview: false,
        opacity: false,
        hue: true,

        // Input / output Options
        interaction: {
            hex: true,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            clear: false,
            save: true
        }
    }
});



// add hover color picker
var hoverPickr = Pickr.create({
    el: '#hover-picker-inner-wrapper',
    theme: 'nano',

    components: {
        // Main components
        preview: false,
        opacity: false,
        hue: true,

        // Input / output Options
        interaction: {
            hex: true,
            rgba: false,
            hsla: false,
            hsva: false,
            cmyk: false,
            input: true,
            clear: false,
            save: true
        }
    }
});




pickr.on('init', function() {
    pickr.setColor('#bbbbbb');
    $('.pcr-type').val('HEX');
});

hoverPickr.on('init', function() {
    hoverPickr.setColor('#444444');
});

pickr.on('save', function() {
    pickr.hide();
});

hoverPickr.on('save', function() {
    hoverPickr.hide();
});





// Actions when main color changes
pickr.on('change', function(color) {
    var hex = color.toHEXA().toString();
    var rgb = color.toRGBA();
    // if light color, set darker page bg color
    if ( rgb[0] + rgb[1] + rgb[2] > 700 ) {
        $('body').css('background-color', '#ddd');
    } else {
        $('body').css('background-color', '#fff');
    }

    $('#color-picker .pcr-button').css('color', hex);
    $('.icon-svg path').css('fill', hex);


    $('.download-svg').each(function() {
        var icon = $(this).attr('data-icon');

        // set svg download link
        var svg = $('#' + icon + ' svg');
        var width = svg.width();
        var height = svg.height();
        var svgHTML = $('#' + icon).html();
        var svgAsXML = (new XMLSerializer).serializeToString(svg[0]);
        var dataURI = "data:image/svg+xml," + encodeURIComponent(svgAsXML);
        $(this).attr('href', dataURI);

        // set html download link
        var hoverColor = hoverPickr.getColor().toHEXA().toString();
        var newSvgHtml = `
                <style>
                #${icon} {
                    transition: .2s all ease;
                    height: 80px;
                }

                #${icon}:hover path {
                    fill: ${hoverColor} !important;
                }
                </style>
                ${svgHTML}
            `;
        $('.download-html[data-icon="' + icon + '"]').attr('href', 'data:text/html,' + encodeURIComponent(newSvgHtml));

        // set png download link
        var canvas = document.getElementById(icon + '-canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        var drawCanvas = canvg.Canvg.fromString(ctx, svgHTML);
        drawCanvas.start();
        var png = canvas.toDataURL("image/png");
        $(this).next('.download-png').attr('href', png);
    });
});




// Actions when hover color changes
hoverPickr.on('change', function(color) {
    var hex = color.toHEXA().toString();
    var rgb = color.toRGBA();
    // if light color, set darker page bg color
    if ( rgb[0] + rgb[1] + rgb[2] > 600 ) {
        $('#hover-picker .pcr-button').css('border', '2px solid #bbb');
    } else {
        $('#hover-picker .pcr-button').css('border', 'none');
    }

    $('#hover-picker .pcr-button').css('color', hex);


    $('.download-svg').each(function() {
        var icon = $(this).attr('data-icon');

        // set svg download link
        var svg = $('#' + icon + ' svg');
        var svgHTML = $('#' + icon).html();
        var svgAsXML = (new XMLSerializer).serializeToString(svg[0]);
        var dataURI = "data:image/svg+xml," + encodeURIComponent(svgAsXML);

        // set html download link
        var hoverColor = hoverPickr.getColor().toHEXA().toString();
        var newSvgHtml = `
            <style>
            #${icon} {
                transition: .2s all ease;
                height: 80px;
            }

            #${icon}:hover path {
                fill: ${hoverColor} !important;
            }
            </style>
            ${svgHTML}
            `;
        $('.download-html[data-icon="' + icon + '"]').attr('href', 'data:text/html,' + encodeURIComponent(newSvgHtml));

        $('head').append(`
            <style>
            body #social-icons svg:hover path {
                fill: ${hoverColor} !important;
            }
            </style>
        `);
    });
});




// Filter based on style
$('#filters-wrapper input').on('click', function() {

    $('#filters-wrapper input').each(function() {
        $(this)[0].checked = false;
    });

    $(this)[0].checked = true;

    var style = $(this).attr('data-style');

    if ( style == 'all' ) {
        $('.icon-wrapper').show();
    } else {
        $('.icon-wrapper').hide();
        $('.icon-wrapper[data-style="' + style + '"]').show();
    }

}); /* end $('#filters-wrapper input').on('click', function() */