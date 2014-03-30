(function(f, define){
    define([ "./kendo.data", "./kendo.userevents", "./kendo.dataviz.core", "./kendo.dataviz.svg", "./kendo.dataviz.themes" ], f);
})(function(){

var __meta__ = {
    id: "dataviz.chart",
    name: "Chart",
    category: "dataviz",
    description: "The Chart widget uses modern browser technologies to render high-quality data visualizations in the browser.",
    depends: [ "data", "userevents", "dataviz.core", "dataviz.svg", "dataviz.themes" ],
    features: [ {
        id: "dataviz.chart-polar",
        name: "Polar & Radar",
        description: "Support for Polar and Radar charts.",
        depends: [ "dataviz.chart.polar" ],
        requireJS: false
    }, {
        id: "dataviz.chart-funnel",
        name: "Funnel chart",
        description: "Support for Funnel chart.",
        depends: [ "dataviz.chart.funnel" ],
        requireJS: false
    } ]
};

(function ($, undefined) {
    // Imports ================================================================
    var each = $.each,
        isArray = $.isArray,
        map = $.map,
        math = Math,
        extend = $.extend,
        proxy = $.proxy,

        kendo = window.kendo,
        Class = kendo.Class,
        Observable = kendo.Observable,
        DataSource = kendo.data.DataSource,
        Widget = kendo.ui.Widget,
        deepExtend = kendo.deepExtend,
        getter = kendo.getter,
        isFn = kendo.isFunction,
        template = kendo.template,

        dataviz = kendo.dataviz,
        Axis = dataviz.Axis,
        AxisLabel = dataviz.AxisLabel,
        BarAnimation = dataviz.BarAnimation,
        Box2D = dataviz.Box2D,
        BoxElement = dataviz.BoxElement,
        ChartElement = dataviz.ChartElement,
        Color = dataviz.Color,
        CurveProcessor = dataviz.CurveProcessor,
        ElementAnimation = dataviz.ElementAnimation,
        Note = dataviz.Note,
        LogarithmicAxis = dataviz.LogarithmicAxis,
        NumericAxis = dataviz.NumericAxis,
        Point2D = dataviz.Point2D,
        RootElement = dataviz.RootElement,
        Ring = dataviz.Ring,
        ShapeElement = dataviz.ShapeElement,
        Text = dataviz.Text,
        TextBox = dataviz.TextBox,
        Title = dataviz.Title,
        animationDecorator = dataviz.animationDecorator,
        append = dataviz.append,
        autoFormat = dataviz.autoFormat,
        defined = dataviz.defined,
        dateComparer = dataviz.dateComparer,
        getElement = dataviz.getElement,
        getSpacing = dataviz.getSpacing,
        inArray = dataviz.inArray,
        interpolateValue = dataviz.interpolateValue,
        last = dataviz.last,
        limitValue = dataviz.limitValue,
        mwDelta = dataviz.mwDelta,
        round = dataviz.round,
        renderTemplate = dataviz.renderTemplate,
        uniqueId = dataviz.uniqueId,
        valueOrDefault = dataviz.valueOrDefault;

    // Constants ==============================================================
    var NS = ".kendoChart",
        ABOVE = "above",
        AREA = "area",
        AUTO = "auto",
        FIT = "fit",
        AXIS_LABEL_CLICK = dataviz.AXIS_LABEL_CLICK,
        BAR = "bar",
        BAR_BORDER_BRIGHTNESS = 0.8,
        BELOW = "below",
        BLACK = "#000",
        BOTH = "both",
        BOTTOM = "bottom",
        BOX_PLOT = "boxPlot",
        BUBBLE = "bubble",
        BULLET = "bullet",
        CANDLESTICK = "candlestick",
        CATEGORY = "category",
        CENTER = "center",
        CHANGE = "change",
        CIRCLE = "circle",
        CLIP = dataviz.CLIP,
        COLOR = "color",
        COLUMN = "column",
        COORD_PRECISION = dataviz.COORD_PRECISION,
        CROSS = "cross",
        CSS_PREFIX = "k-",
        DATABOUND = "dataBound",
        DATE = "date",
        DAYS = "days",
        DEFAULT_FONT = dataviz.DEFAULT_FONT,
        DEFAULT_HEIGHT = dataviz.DEFAULT_HEIGHT,
        DEFAULT_PRECISION = dataviz.DEFAULT_PRECISION,
        DEFAULT_WIDTH = dataviz.DEFAULT_WIDTH,
        DEFAULT_ERROR_BAR_WIDTH = 4,
        DONUT = "donut",
        DONUT_SECTOR_ANIM_DELAY = 50,
        DRAG = "drag",
        DRAG_END = "dragEnd",
        DRAG_START = "dragStart",
        ERROR_LOW_FIELD = "errorLow",
        ERROR_HIGH_FIELD = "errorHigh",
        X_ERROR_LOW_FIELD = "xErrorLow",
        X_ERROR_HIGH_FIELD = "xErrorHigh",
        Y_ERROR_LOW_FIELD = "yErrorLow",
        Y_ERROR_HIGH_FIELD = "yErrorHigh",
        FADEIN = "fadeIn",
        FUNNEL = "funnel",
        GLASS = "glass",
        HOURS = "hours",
        INITIAL_ANIMATION_DURATION = dataviz.INITIAL_ANIMATION_DURATION,
        INSIDE_BASE = "insideBase",
        INSIDE_END = "insideEnd",
        INTERPOLATE = "interpolate",
        LEFT = "left",
        LEGEND_ITEM_CLICK = "legendItemClick",
        LEGEND_ITEM_HOVER = "legendItemHover",
        LINE = "line",
        LINE_MARKER_SIZE = 8,
        LOGARITHMIC = "log",
        MAX_EXPAND_DEPTH = 5,
        MAX_VALUE = Number.MAX_VALUE,
        MIN_VALUE = -Number.MAX_VALUE,
        MINUTES = "minutes",
        MONTHS = "months",
        MOUSELEAVE_NS = "mouseleave" + NS,
        MOUSEMOVE_TRACKING = "mousemove.tracking",
        MOUSEOVER_NS = "mouseover" + NS,
        MOUSEOUT_NS = "mouseout" + NS,
        MOUSEMOVE_NS = "mousemove" + NS,
        MOUSEMOVE_THROTTLE = 20,
        MOUSEWHEEL_DELAY = 150,
        MOUSEWHEEL_NS = "DOMMouseScroll" + NS + " mousewheel" + NS,
        NOTE_CLICK = dataviz.NOTE_CLICK,
        NOTE_HOVER = dataviz.NOTE_HOVER,
        NOTE_TEXT = "noteText",
        OBJECT = "object",
        OHLC = "ohlc",
        OUTSIDE_END = "outsideEnd",
        OUTLINE_SUFFIX = "_outline",
        PIE = "pie",
        PIE_SECTOR_ANIM_DELAY = 70,
        PLOT_AREA_CLICK = "plotAreaClick",
        POINTER = "pointer",
        RIGHT = "right",
        ROUNDED_BEVEL = "roundedBevel",
        ROUNDED_GLASS = "roundedGlass",
        SCATTER = "scatter",
        SCATTER_LINE = "scatterLine",
        SECONDS = "seconds",
        SELECT_START = "selectStart",
        SELECT = "select",
        SELECT_END = "selectEnd",
        SERIES_CLICK = "seriesClick",
        SERIES_HOVER = "seriesHover",
        STEP = "step",
        SMOOTH = "smooth",
        STD_ERR = "stderr",
        STD_DEV = "stddev",
        STRING = "string",
        TIME_PER_SECOND = 1000,
        TIME_PER_MINUTE = 60 * TIME_PER_SECOND,
        TIME_PER_HOUR = 60 * TIME_PER_MINUTE,
        TIME_PER_DAY = 24 * TIME_PER_HOUR,
        TIME_PER_WEEK = 7 * TIME_PER_DAY,
        TIME_PER_MONTH = 31 * TIME_PER_DAY,
        TIME_PER_YEAR = 365 * TIME_PER_DAY,
        TIME_PER_UNIT = {
            "years": TIME_PER_YEAR,
            "months": TIME_PER_MONTH,
            "weeks": TIME_PER_WEEK,
            "days": TIME_PER_DAY,
            "hours": TIME_PER_HOUR,
            "minutes": TIME_PER_MINUTE,
            "seconds": TIME_PER_SECOND
        },
        TOP = "top",
        TOOLTIP_ANIMATION_DURATION = 150,
        TOOLTIP_OFFSET = 5,
        TOOLTIP_SHOW_DELAY = 100,
        TOOLTIP_HIDE_DELAY = 100,
        TOOLTIP_INVERSE = "tooltip-inverse",
        VALUE = "value",
        VERTICAL_AREA = "verticalArea",
        VERTICAL_BULLET = "verticalBullet",
        VERTICAL_LINE = "verticalLine",
        WEEKS = "weeks",
        WHITE = "#fff",
        X = "x",
        Y = "y",
        YEARS = "years",
        ZERO = "zero",
        ZOOM_ACCELERATION = 3,
        ZOOM_START = "zoomStart",
        ZOOM = "zoom",
        ZOOM_END = "zoomEnd",
        BASE_UNITS = [
            SECONDS, MINUTES, HOURS, DAYS, WEEKS, MONTHS, YEARS
        ],
        EQUALLY_SPACED_SERIES = [
            BAR, COLUMN, OHLC, CANDLESTICK, BOX_PLOT, BULLET
        ];

    var DateLabelFormats = {
        seconds: "HH:mm:ss",
        minutes: "HH:mm",
        hours: "HH:mm",
        days: "M/d",
        weeks: "M/d",
        months: "MMM 'yy",
        years: "yyyy"
    };

    // Chart ==================================================================
    var Chart = Widget.extend({
        init: function(element, userOptions) {
            var chart = this,
                options;

            kendo.destroy(element);

            Widget.fn.init.call(chart, element);
            options = deepExtend({}, chart.options, userOptions);

            chart.element
                .addClass(CSS_PREFIX + options.name.toLowerCase())
                .css("position", "relative");

            chart._originalOptions = deepExtend({}, options);

            chart._initTheme(options);

            chart.bind(chart.events, chart.options);

            chart.wrapper = chart.element;

            chart._initDataSource(userOptions);

            kendo.notify(chart, dataviz.ui);
        },

        _initTheme: function(options) {
            var chart = this,
                themes = dataviz.ui.themes || {},
                themeName = options.theme,
                theme = themes[themeName] || themes[themeName.toLowerCase()],
                themeOptions = themeName && theme ? theme.chart : {},
                seriesCopies = [],
                series = options.series || [],
                i;

            for (i = 0; i < series.length; i++) {
                seriesCopies.push($.extend({}, series[i]));
            }
            options.series = seriesCopies;

            resolveAxisAliases(options);
            chart._applyDefaults(options, themeOptions);

            // Clean up default if not overriden by data attributes
            if (options.seriesColors === null) {
                options.seriesColors = undefined;
            }

            chart.options = deepExtend({}, themeOptions, options);
            applySeriesColors(chart.options);
        },

        _initDataSource: function(userOptions) {
            var chart = this,
                dataSourceOptions = (userOptions || {}).dataSource;

            chart._dataChangeHandler = proxy(chart._onDataChanged, chart);

            chart.dataSource = DataSource
                .create(dataSourceOptions)
                .bind(CHANGE, chart._dataChangeHandler);

            chart._bindCategories();

            chart._redraw();
            chart._attachEvents();

            if (dataSourceOptions && chart.options.autoBind) {
                chart.dataSource.fetch();
            }
        },

        setDataSource: function(dataSource) {
            var chart = this;

            chart.dataSource.unbind(CHANGE, chart._dataChangeHandler);
            chart.dataSource = chart._originalOptions.dataSource = dataSource;

            dataSource.bind(CHANGE, chart._dataChangeHandler);

            if (chart.options.autoBind) {
                dataSource.fetch();
            }
        },

        events:[
            DATABOUND,
            SERIES_CLICK,
            SERIES_HOVER,
            AXIS_LABEL_CLICK,
            LEGEND_ITEM_CLICK,
            LEGEND_ITEM_HOVER,
            PLOT_AREA_CLICK,
            DRAG_START,
            DRAG,
            DRAG_END,
            ZOOM_START,
            ZOOM,
            ZOOM_END,
            SELECT_START,
            SELECT,
            SELECT_END,
            NOTE_CLICK,
            NOTE_HOVER
        ],

        items: function() {
            return $();
        },

        options: {
            name: "Chart",
            renderAs: "",
            theme: "default",
            chartArea: {},
            legend: {
                visible: true,
                labels: {}
            },
            categoryAxis: {},
            autoBind: true,
            seriesDefaults: {
                type: COLUMN,
                data: [],
                highlight: {
                    visible: true
                },
                labels: {},
                negativeValues: {
                    visible: false
                }
            },
            series: [],
            seriesColors: null,
            tooltip: {
                visible: false
            },
            transitions: true,
            valueAxis: {},
            plotArea: {},
            title: {},
            xAxis: {},
            yAxis: {},
            panes: [{}]
        },

        refresh: function() {
            var chart = this;

            chart._applyDefaults(chart.options);

            applySeriesColors(chart.options);

            chart._bindSeries();
            chart._bindCategories();

            chart.trigger(DATABOUND);
            chart._redraw();
        },

        getSize: function() {
            return kendo.dimensions(this.element);
        },

        _resize: function() {
            var t = this.options.transitions;
            this.options.transitions = false;

            this._redraw();

            this.options.transitions = t;
        },

        redraw: function(paneName) {
            var chart = this,
                pane,
                plotArea;

            chart._applyDefaults(chart.options);
            applySeriesColors(chart.options);

            if (paneName) {
                plotArea = chart._model._plotArea;
                pane = plotArea.findPane(paneName);
                plotArea.redraw(pane);
            } else {
                chart._redraw();
            }
        },

        _redraw: function() {
            var chart = this,
                model = chart._getModel(),
                view;

            chart._destroyView();

            chart._model = model;
            chart._plotArea = model._plotArea;

            view = chart._view =
                dataviz.ViewFactory.current.create(model.options, chart.options.renderAs);

            if (view) {
                view.load(model);
                chart._viewElement = chart._renderView(view);
                chart._tooltip = chart._createTooltip();
                chart._highlight = new Highlight(view);
                chart._setupSelection();
            }
        },

        _sharedTooltip: function() {
            var chart = this,
                options = chart.options;

            return chart._plotArea instanceof CategoricalPlotArea && options.tooltip.shared;
        },

        _createTooltip: function() {
            var chart = this,
                options = chart.options,
                element = chart.element,
                tooltip;

            if (chart._sharedTooltip()) {
                tooltip = new SharedTooltip(element, chart._plotArea, options.tooltip);
            } else {
                tooltip = new Tooltip(element, options.tooltip);
            }

            return tooltip;
        },

        _renderView: function() {
            var chart = this;
            return chart._view.renderTo(chart.element[0]);
        },

        _applyDefaults: function(options, themeOptions) {
            applyAxisDefaults(options, themeOptions);
            applySeriesDefaults(options, themeOptions);
        },

        _getModel: function() {
            var chart = this,
                options = chart.options,
                model = new RootElement(chart._modelOptions()),
                plotArea;

            model.parent = chart;

            Title.buildTitle(options.title, model);

            plotArea = model._plotArea = chart._createPlotArea();
            if (options.legend.visible) {
                model.append(new Legend(plotArea.options.legend));
            }
            model.append(plotArea);
            model.reflow();

            return model;
        },

        _modelOptions: function() {
            var chart = this,
                options = chart.options,
                element = chart.element,
                height = math.floor(element.height()),
                width = math.floor(element.width());

            return deepExtend({
                width: width || DEFAULT_WIDTH,
                height: height || DEFAULT_HEIGHT,
                transitions: options.transitions
            }, options.chartArea);
        },

        _createPlotArea: function() {
            var chart = this,
                options = chart.options;

            return PlotAreaFactory.current.create(options.series, options);
        },

        _setupSelection: function() {
            var chart = this,
                plotArea = chart._plotArea,
                axes = plotArea.axes,
                selections = chart._selections = [],
                selection, i, axis,
                min, max, options;

            if (!chart._selectStartHandler) {
                chart._selectStartHandler = proxy(chart._selectStart, chart);
                chart._selectHandler = proxy(chart._select, chart);
                chart._selectEndHandler = proxy(chart._selectEnd, chart);
            }

            for (i = 0; i < axes.length; i++) {
                axis = axes[i];
                options = axis.options;
                if (axis instanceof CategoryAxis && options.select && !options.vertical) {
                    min = 0;
                    max = options.categories.length - 1;

                    if (axis instanceof DateCategoryAxis) {
                        min = options.categories[min];
                        max = options.categories[max];
                    }

                    if (!options.justified) {
                        if (axis instanceof DateCategoryAxis) {
                            max = addDuration(max, 1, options.baseUnit, options.weekStartDay);
                        } else {
                            max++;
                        }
                    }

                    selection = new Selection(chart, axis,
                        deepExtend({ min: min, max: max }, options.select)
                    );

                    selection.bind(SELECT_START, chart._selectStartHandler);
                    selection.bind(SELECT, chart._selectHandler);
                    selection.bind(SELECT_END, chart._selectEndHandler);

                    selections.push(selection);
                }
            }
        },

        _selectStart: function(e) {
            return this.trigger(SELECT_START, e);
        },

        _select: function(e) {
            return this.trigger(SELECT, e);
        },

        _selectEnd: function(e) {
            return this.trigger(SELECT_END, e);
        },

        _attachEvents: function() {
            var chart = this,
                element = chart.element;

            element.on(MOUSEOVER_NS, proxy(chart._mouseover, chart));
            element.on(MOUSEOUT_NS, proxy(chart._mouseout, chart));
            element.on(MOUSEWHEEL_NS, proxy(chart._mousewheel, chart));
            element.on(MOUSELEAVE_NS, proxy(chart._mouseleave, chart));
            if (chart._shouldAttachMouseMove()) {
                element.on(MOUSEMOVE_NS, proxy(chart._mousemove, chart));
            }

            if (kendo.UserEvents) {
                chart._userEvents = new kendo.UserEvents(element, {
                    global: true,
                    filter: ":not(.k-selector)",
                    multiTouch: false,
                    tap: proxy(chart._tap, chart),
                    start: proxy(chart._start, chart),
                    move: proxy(chart._move, chart),
                    end: proxy(chart._end, chart)
                });
            }
        },

        _mouseout: function(e) {
            var chart = this,
                element = chart._model.modelMap[e.target.getAttribute("data-model-id")];

            if (element && element.leave) {
                element.leave(chart, e);
            }
        },

        _start: function(e) {
            var chart = this,
                events = chart._events;

            if (defined(events[DRAG_START] || events[DRAG] || events[DRAG_END])) {
                chart._startNavigation(e, DRAG_START);
            }
        },

        _move: function(e) {
            var chart = this,
                state = chart._navState,
                axes,
                ranges = {},
                i, currentAxis, axisName, axis, delta;

            if (state) {
                e.preventDefault();

                axes = state.axes;

                for (i = 0; i < axes.length; i++) {
                    currentAxis = axes[i];
                    axisName = currentAxis.options.name;
                    if (axisName) {
                        axis = currentAxis.options.vertical ? e.y : e.x;
                        delta = axis.startLocation - axis.location;

                        if (delta !== 0) {
                            ranges[currentAxis.options.name] =
                                currentAxis.translateRange(delta);
                        }
                    }
                }

                state.axisRanges = ranges;
                chart.trigger(DRAG, {
                   axisRanges: ranges,
                   originalEvent: e
                });
            }
        },

        _end: function(e) {
            this._endNavigation(e, DRAG_END);
        },

        _mousewheel: function(e) {
            var chart = this,
                origEvent = e.originalEvent,
                prevented,
                delta = mwDelta(e),
                totalDelta,
                state = chart._navState,
                axes,
                i,
                currentAxis,
                axisName,
                ranges = {};

            if (!state) {
                prevented = chart._startNavigation(origEvent, ZOOM_START);
                if (!prevented) {
                    state = chart._navState;
                }
            }

            if (state) {
                totalDelta = state.totalDelta || delta;
                state.totalDelta = totalDelta + delta;

                axes = chart._navState.axes;

                for (i = 0; i < axes.length; i++) {
                    currentAxis = axes[i];
                    axisName = currentAxis.options.name;
                    if (axisName) {
                        ranges[axisName] = currentAxis.scaleRange(-totalDelta);
                    }
                }

                chart.trigger(ZOOM, {
                    delta: delta,
                    axisRanges: ranges,
                    originalEvent: e
                });

                if (chart._mwTimeout) {
                    clearTimeout(chart._mwTimeout);
                }

                chart._mwTimeout = setTimeout(function() {
                    chart._endNavigation(e, ZOOM_END);
                }, MOUSEWHEEL_DELAY);
            }
        },

        _startNavigation: function(e, chartEvent) {
            var chart = this,
                coords = chart._eventCoordinates(e),
                plotArea = chart._model._plotArea,
                pane = plotArea.findPointPane(coords),
                axes = plotArea.axes.slice(0),
                i,
                currentAxis,
                inAxis = false,
                prevented;

            if (!pane) {
                return;
            }

            for (i = 0; i < axes.length; i++) {
                currentAxis = axes[i];
                if (currentAxis.box.containsPoint(coords)) {
                    inAxis = true;
                    break;
                }
            }

            if (!inAxis && plotArea.backgroundBox().containsPoint(coords)) {
                prevented = chart.trigger(chartEvent, {
                    axisRanges: axisRanges(axes),
                    originalEvent: e
                });

                if (prevented) {
                    chart._userEvents.cancel();
                } else {
                    chart._suppressHover = true;
                    chart._unsetActivePoint();
                    chart._navState = {
                        pane: pane,
                        axes: axes
                    };
                }
            }
        },

        _endNavigation: function(e, chartEvent) {
            var chart = this;

            if (chart._navState) {
                chart.trigger(chartEvent, {
                    axisRanges: chart._navState.axisRanges,
                    originalEvent: e
                });
                chart._suppressHover = false;
                chart._navState = null;
            }
        },

        _getChartElement: function(e) {
            var chart = this,
                modelId = $(e.target).data("modelId"),
                model = chart._model,
                element;

            if (modelId) {
                element = model.modelMap[modelId];
            }

            if (element && element.aliasFor) {
                element = element.aliasFor(e, chart._eventCoordinates(e));
            }

            return element;
        },

        _eventCoordinates: function(e) {
            var chart = this,
                isTouch = defined((e.x || {}).client),
                clientX = isTouch ? e.x.client : e.clientX,
                clientY = isTouch ? e.y.client : e.clientY;

            return chart._toModelCoordinates(clientX, clientY);
        },

        _toModelCoordinates: function(clientX, clientY) {
            var element = this.element,
                offset = element.offset(),
                paddingLeft = parseInt(element.css("paddingLeft"), 10),
                paddingTop = parseInt(element.css("paddingTop"), 10),
                win = $(window);

            return new Point2D(
                clientX - offset.left - paddingLeft + win.scrollLeft(),
                clientY - offset.top - paddingTop + win.scrollTop()
            );
        },

        _tap: function(e) {
            var chart = this,
                element = chart._getChartElement(e);

            if (chart._activePoint === element) {
                chart._click(e);
            } else {
                if (!chart._startHover(e)) {
                    chart._unsetActivePoint();
                }

                chart._click(e);
            }
        },

        _click: function(e) {
            var chart = this,
                element = chart._getChartElement(e);

            while (element) {
                if (element.click) {
                    element.click(chart, e);
                }

                element = element.parent;
            }
        },

        _startHover: function(e) {
            var chart = this,
                tooltip = chart._tooltip,
                highlight = chart._highlight,
                tooltipOptions = chart.options.tooltip,
                point;

            if (chart._suppressHover || !highlight ||
                inArray(e.target, highlight._overlays) || chart._sharedTooltip()) {
                return;
            }

            point = chart._getChartElement(e);
            if (point && point.hover) {
                point.hover(chart, e);
                if (!e.isDefaultPrevented()) {
                    chart._activePoint = point;

                    tooltipOptions = deepExtend({}, tooltipOptions, point.options.tooltip);
                    if (tooltipOptions.visible) {
                        tooltip.show(point);
                    }

                    highlight.show(point);

                    return true;
                }
            }
        },

        _mouseover: function(e) {
            var chart = this;

            if (chart._startHover(e)) {
                $(document).on(MOUSEMOVE_TRACKING, proxy(chart._mouseMoveTracking, chart));
            }
        },

        _mouseMoveTracking: function(e) {
            var chart = this,
                options = chart.options,
                tooltip = chart._tooltip,
                highlight = chart._highlight,
                coords = chart._eventCoordinates(e),
                point = chart._activePoint,
                tooltipOptions, owner, seriesPoint;

            if (chart._plotArea.box.containsPoint(coords)) {
                if (point && point.series && inArray(point.series.type, [ LINE, AREA ])) {
                    owner = point.parent;
                    seriesPoint = owner.getNearestPoint(coords.x, coords.y, point.seriesIx);
                    if (seriesPoint && seriesPoint != point) {
                        seriesPoint.hover(chart, e);
                        chart._activePoint = seriesPoint;

                        tooltipOptions = deepExtend({}, options.tooltip, point.options.tooltip);
                        if (tooltipOptions.visible) {
                            tooltip.show(seriesPoint);
                        }

                        highlight.show(seriesPoint);
                    }
                }
            } else {
                $(document).off(MOUSEMOVE_TRACKING);
                chart._unsetActivePoint();
            }
        },

        _mousemove: function(e) {
            var chart = this,
                now = new Date(),
                timestamp = chart._mousemove.timestamp;

            if (!timestamp || now - timestamp > MOUSEMOVE_THROTTLE) {
                var coords = chart._eventCoordinates(e);

                chart._trackCrosshairs(coords);

                if (chart._sharedTooltip()) {
                    chart._trackSharedTooltip(coords);
                }

                chart._mousemove.timestamp = now;
            }
        },

        _trackCrosshairs: function(coords) {
            var crosshairs = this._plotArea.crosshairs,
                i,
                current;

            for (i = 0; i < crosshairs.length; i++) {
                current = crosshairs[i];

                if (current.box.containsPoint(coords)) {
                    current.showAt(coords);
                } else {
                    current.hide();
                }
            }
        },

        _trackSharedTooltip: function(coords) {
            var chart = this,
                options = chart.options,
                plotArea = chart._plotArea,
                categoryAxis = plotArea.categoryAxis,
                tooltip = chart._tooltip,
                tooltipOptions = options.tooltip,
                highlight = chart._highlight,
                index, points;

            if (plotArea.box.containsPoint(coords)) {
                index = categoryAxis.pointCategoryIndex(coords);
                if (index !== chart._tooltipCategoryIx) {
                    points = plotArea.pointsByCategoryIndex(index);

                    if (points.length > 0) {
                        if (tooltipOptions.visible) {
                            tooltip.showAt(points, coords);
                        }

                        highlight.show(points);
                    } else {
                        tooltip.hide();
                    }

                    chart._tooltipCategoryIx = index;
                }
            }
        },

        _mouseleave: function(e) {
            var chart = this,
                plotArea = chart._plotArea,
                crosshairs = plotArea.crosshairs,
                tooltip = chart._tooltip,
                highlight = chart._highlight,
                i;

            if (e.relatedTarget) {
                for (i = 0; i < crosshairs.length; i++) {
                    crosshairs[i].hide();
                }

                setTimeout(proxy(tooltip.hide, tooltip), TOOLTIP_HIDE_DELAY);
                highlight.hide();
                chart._tooltipCategoryIx = null;
            }
        },

        _unsetActivePoint: function() {
            var chart = this,
                tooltip = chart._tooltip,
                highlight = chart._highlight;

            chart._activePoint = null;

            if (tooltip) {
                tooltip.hide();
            }

            if (highlight) {
                highlight.hide();
            }
        },

        _onDataChanged: function() {
            var chart = this,
                options = chart.options,
                series = chart._sourceSeries || options.series,
                seriesIx,
                seriesLength = series.length,
                data = chart.dataSource.view(),
                grouped = (chart.dataSource.group() || []).length > 0,
                processedSeries = [],
                currentSeries;

            for (seriesIx = 0; seriesIx < seriesLength; seriesIx++) {
                currentSeries = series[seriesIx];

                if (chart._isBindable(currentSeries) && grouped) {
                    append(processedSeries,
                           groupSeries(currentSeries, data));
                } else {
                    processedSeries.push(currentSeries || []);
                }
            }

            chart._sourceSeries = series;
            options.series = processedSeries;

            applySeriesColors(chart.options);

            chart._bindSeries();
            chart._bindCategories();

            chart.trigger(DATABOUND);
            chart._redraw();
        },

        _bindSeries: function() {
            var chart = this,
                data = chart.dataSource.view(),
                series = chart.options.series,
                seriesIx,
                seriesLength = series.length,
                currentSeries,
                groupIx,
                seriesData;

            for (seriesIx = 0; seriesIx < seriesLength; seriesIx++) {
                currentSeries = series[seriesIx];

                if (chart._isBindable(currentSeries)) {
                    groupIx = currentSeries._groupIx;
                    seriesData = defined(groupIx) ? (data[groupIx] || {}).items : data;

                    if (currentSeries.autoBind !== false) {
                        currentSeries.data = seriesData;
                    }
                }
            }
        },

        _bindCategories: function() {
            var chart = this,
                data = chart.dataSource.view() || [],
                grouped = (chart.dataSource.group() || []).length > 0,
                categoriesData = data,
                options = chart.options,
                definitions = [].concat(options.categoryAxis),
                axisIx,
                axis;

            if (grouped) {
                if (data.length) {
                    categoriesData = data[0].items;
                }
            }

            for (axisIx = 0; axisIx < definitions.length; axisIx++) {
                axis = definitions[axisIx];
                if (axis.autoBind !== false) {
                    chart._bindCategoryAxis(axis, categoriesData, axisIx);
                }
            }
        },

        _bindCategoryAxis: function(axis, data, axisIx) {
            var count = (data || []).length,
                categoryIx,
                category,
                row;

            if (axis.field) {
                axis.categories = [];
                for (categoryIx = 0; categoryIx < count; categoryIx++) {
                    row = data[categoryIx];

                    category = getField(axis.field, row);
                    if (categoryIx === 0) {
                        axis.categories = [category];
                        axis.dataItems = [row];
                    } else {
                        axis.categories.push(category);
                        axis.dataItems.push(row);
                    }
                }
            } else {
                this._bindCategoryAxisFromSeries(axis, axisIx);
            }
        },

        _bindCategoryAxisFromSeries: function(axis, axisIx) {
            var chart = this,
                items = [],
                result,
                series = chart.options.series,
                seriesLength = series.length,
                seriesIx,
                s,
                onAxis,
                data,
                dataIx,
                dataLength,
                dataRow,
                category,
                uniqueCategories = {},
                getFn,
                dateAxis;

            for (seriesIx = 0; seriesIx < seriesLength; seriesIx++) {
                s = series[seriesIx];
                onAxis = s.categoryAxis === axis.name || (!s.categoryAxis && axisIx === 0);
                data = s.data;
                dataLength = data.length;

                if (s.categoryField && onAxis && dataLength > 0) {
                    dateAxis = isDateAxis(axis, getField(s.categoryField, data[0]));
                    getFn = dateAxis ? getDateField : getField;

                    for (dataIx = 0; dataIx < dataLength; dataIx++) {
                        dataRow = data[dataIx];
                        category = getFn(s.categoryField, dataRow);

                        if (dateAxis || !uniqueCategories[category]) {
                            items.push([category, dataRow]);

                            if (!dateAxis) {
                                uniqueCategories[category] = true;
                            }
                        }
                    }
                }
            }

            if (items.length > 0) {
                if (dateAxis) {
                    items = uniqueDates(items, function(a, b) {
                        return dateComparer(a[0], b[0]);
                    });
                }

                result = transpose(items);
                axis.categories = result[0];
                axis.dataItems = result[1];
            }
        },

        _isBindable: function(series) {
            var valueFields = SeriesBinder.current.valueFields(series),
                result = true,
                field, i;

            for (i = 0; i < valueFields.length; i++) {
                field = valueFields[i];
                if (field === VALUE) {
                    field = "field";
                } else {
                    field = field + "Field";
                }

                if (!defined(series[field])) {
                    result = false;
                    break;
                }
            }

            return result;
        },

        _legendItemClick: function(seriesIndex, pointIndex) {
            var chart = this,
                plotArea = chart._plotArea,
                currentSeries = (plotArea.srcSeries || plotArea.series)[seriesIndex],
                originalSeries = (chart._sourceSeries || [])[seriesIndex] || currentSeries,
                transitionsState, visible, point;

            if (inArray(currentSeries.type, [PIE, DONUT,FUNNEL])) {
                point = originalSeries.data[pointIndex];
                if (!defined(point.visible)) {
                    visible = false;
                } else {
                    visible = !point.visible;
                }
                point.visible = visible;
            } else {
                visible = !originalSeries.visible;
                originalSeries.visible = visible;
                currentSeries.visible = visible;
            }

            if (chart.options.transitions) {
                chart.options.transitions = false;
                transitionsState = true;
            }
            chart.redraw();
            if (transitionsState) {
                chart.options.transitions = true;
            }
        },

        _legendItemHover: function(seriesIndex, pointIndex) {
            var chart = this,
                plotArea = chart._plotArea,
                highlight = chart._highlight,
                currentSeries = (plotArea.srcSeries || plotArea.series)[seriesIndex],
                index, items;

            if (inArray(currentSeries.type, [PIE, DONUT, FUNNEL])) {
                index = pointIndex;
            } else {
                index = seriesIndex;
            }

            items = plotArea.pointsBySeriesIndex(index);
            highlight.show(items);
        },

        _shouldAttachMouseMove: function() {
            var chart = this;

            return chart._plotArea.crosshairs.length || (chart._tooltip && chart._sharedTooltip());
        },

        setOptions: function(options) {
            var chart = this;

            chart._originalOptions = deepExtend(chart._originalOptions, options);
            chart.options = deepExtend({}, chart._originalOptions);
            chart._sourceSeries = null;
            $(document).off(MOUSEMOVE_NS);

            Widget.fn._setEvents.call(chart, options);

            chart._initTheme(chart.options);

            if (options.dataSource) {
                chart.setDataSource(
                    DataSource.create(options.dataSource)
                );
            }
            if (chart._shouldAttachMouseMove()) {
                chart.element.on(MOUSEMOVE_NS, proxy(chart._mousemove, chart));
            }

            if (chart.options.dataSource) {
                chart.refresh();
            }  else {
                chart.redraw();
            }
        },

        destroy: function() {
            var chart = this,
                dataSource = chart.dataSource;

            chart.element.off(NS);
            dataSource.unbind(CHANGE, chart._dataChangeHandler);
            $(document).off(MOUSEMOVE_TRACKING);

            if (chart._userEvents) {
                chart._userEvents.destroy();
            }

            chart._destroyView();

            Widget.fn.destroy.call(chart);
        },

        _destroyView: function() {
            var chart = this,
                model = chart._model,
                view = chart._view,
                selections = chart._selections;

            if (model) {
                model.destroy();
                chart._model = null;
            }

            if (view) {
                view.destroy();
                chart._view = null;
            }

            if (selections) {
                while (selections.length > 0) {
                    selections.shift().destroy();
                }
            }
        }
    });
    deepExtend(Chart.fn, dataviz.ExportMixin);

    var PlotAreaFactory = Class.extend({
        init: function() {
            this._registry = [];
        },

        register: function(type, seriesTypes) {
            this._registry.push({
                type: type,
                seriesTypes: seriesTypes
            });
        },

        create: function(srcSeries, options) {
            var registry = this._registry,
                match = registry[0],
                i,
                entry,
                series;

            for (i = 0; i < registry.length; i++) {
                entry = registry[i];
                series = filterSeriesByType(srcSeries, entry.seriesTypes);

                if (series.length > 0) {
                    match = entry;
                    break;
                }
            }

            return new match.type(series, options);
        }
    });
    PlotAreaFactory.current = new PlotAreaFactory();

    var SeriesBinder = Class.extend({
        init: function() {
            this._valueFields = {};
            this._otherFields = {};
            this._nullValue = {};
            this._undefinedValue = {};
        },

        register: function(seriesTypes, valueFields, otherFields) {
            var binder = this,
                i,
                type;

            valueFields = valueFields || [VALUE];

            for (i = 0; i < seriesTypes.length; i++) {
                type = seriesTypes[i];

                binder._valueFields[type] = valueFields;
                binder._otherFields[type] = otherFields;
                binder._nullValue[type] = binder._makeValue(valueFields, null);
                binder._undefinedValue[type] = binder._makeValue(valueFields, undefined);
            }
        },

        canonicalFields: function(series) {
            return this.valueFields(series).concat(this.otherFields(series));
        },

        valueFields: function(series) {
            return this._valueFields[series.type] || [VALUE];
        },

        otherFields: function(series) {
            return this._otherFields[series.type] || [VALUE];
        },

        bindPoint: function(series, pointIx) {
            var binder = this,
                data = series.data,
                pointData = data[pointIx],
                result = { valueFields: { value: pointData } },
                fields, fieldData,
                srcValueFields, srcPointFields,
                valueFields = binder.valueFields(series),
                otherFields = binder._otherFields[series.type],
                value;

            if (pointData === null) {
                value = binder._nullValue[series.type];
            } else if (!defined(pointData)) {
                value = binder._undefinedValue[series.type];
            } else if (isArray(pointData)) {
                fieldData = pointData.slice(valueFields.length);
                value = binder._bindFromArray(pointData, valueFields);
                fields = binder._bindFromArray(fieldData, otherFields);
            } else if (typeof pointData === OBJECT) {
                srcValueFields = binder.sourceFields(series, valueFields);
                srcPointFields = binder.sourceFields(series, otherFields);

                value = binder._bindFromObject(pointData, valueFields, srcValueFields);
                fields = binder._bindFromObject(pointData, otherFields, srcPointFields);
            }

            if (defined(value)) {
                if (valueFields.length === 1) {
                    result.valueFields.value = value[valueFields[0]];
                } else {
                    result.valueFields = value;
                }
            }

            result.fields = fields || {};

            return result;
        },

        _makeValue: function(fields, initialValue) {
            var value = {},
                i,
                length = fields.length,
                fieldName;

            for (i = 0; i < length; i++) {
                fieldName = fields[i];
                value[fieldName] = initialValue;
            }

            return value;
        },

        _bindFromArray: function(array, fields) {
            var value = {},
                i,
                length;

            if (fields) {
                length = math.min(fields.length, array.length);

                for (i = 0; i < length; i++) {
                    value[fields[i]] = array[i];
                }
            }

            return value;
        },

        _bindFromObject: function(object, fields, srcFields) {
            var value = {},
                i,
                length,
                fieldName,
                srcFieldName;

            if (fields) {
                length = fields.length;
                srcFields = srcFields || fields;

                for (i = 0; i < length; i++) {
                    fieldName = fields[i];
                    srcFieldName = srcFields[i];
                    value[fieldName] = getField(srcFieldName, object);
                }
            }

            return value;
        },

        sourceFields: function(series, canonicalFields) {
            var i, length, fieldName,
                sourceFields, sourceFieldName;

            if (canonicalFields) {
                length = canonicalFields.length;
                sourceFields = [];

                for (i = 0; i < length; i++) {
                    fieldName = canonicalFields[i];
                    sourceFieldName = fieldName === VALUE ? "field" : fieldName + "Field";

                    sourceFields.push(series[sourceFieldName] || fieldName);
                }
            }

            return sourceFields;
        }
    });
    SeriesBinder.current = new SeriesBinder();

    var BarLabel = ChartElement.extend({
        init: function(content, options) {
            var barLabel = this;
            ChartElement.fn.init.call(barLabel, options);

            barLabel.append(new TextBox(content, barLabel.options));
        },

        options: {
            position: OUTSIDE_END,
            margin: getSpacing(3),
            padding: getSpacing(4),
            color: BLACK,
            background: "",
            border: {
                width: 1,
                color: ""
            },
            aboveAxis: true,
            vertical: false,
            animation: {
                type: FADEIN,
                delay: INITIAL_ANIMATION_DURATION
            },
            zIndex: 1
        },

        reflow: function(targetBox) {
            var barLabel = this,
                options = barLabel.options,
                vertical = options.vertical,
                aboveAxis = options.aboveAxis,
                text = barLabel.children[0],
                box = text.box,
                padding = text.options.padding;

            text.options.align = vertical ? CENTER : LEFT;
            text.options.vAlign = vertical ? TOP : CENTER;

            if (options.position == INSIDE_END) {
                if (vertical) {
                    text.options.vAlign = TOP;

                    if (!aboveAxis && box.height() < targetBox.height()) {
                        text.options.vAlign = BOTTOM;
                    }
                } else {
                    text.options.align = aboveAxis ? RIGHT : LEFT;
                }
            } else if (options.position == CENTER) {
                text.options.vAlign = CENTER;
                text.options.align = CENTER;
            } else if (options.position == INSIDE_BASE) {
                if (vertical) {
                    text.options.vAlign = aboveAxis ? BOTTOM : TOP;
                } else {
                    text.options.align = aboveAxis ? LEFT : RIGHT;
                }
            } else if (options.position == OUTSIDE_END) {
                if (vertical) {
                    if (aboveAxis) {
                        targetBox = new Box2D(
                            targetBox.x1, targetBox.y1 - box.height(),
                            targetBox.x2, targetBox.y1
                        );
                    } else {
                        targetBox = new Box2D(
                            targetBox.x1, targetBox.y2,
                            targetBox.x2, targetBox.y2 + box.height()
                        );
                    }
                } else {
                    text.options.align = CENTER;
                    if (aboveAxis) {
                        targetBox = new Box2D(
                            targetBox.x2 + box.width(), targetBox.y1,
                            targetBox.x2, targetBox.y2
                        );
                    } else {
                        targetBox = new Box2D(
                            targetBox.x1 - box.width(), targetBox.y1,
                            targetBox.x1, targetBox.y2
                        );
                    }
                }
            }

            if (vertical) {
                padding.left = padding.right =
                    (targetBox.width() - text.contentBox.width()) / 2;
            } else {
                padding.top = padding.bottom =
                    (targetBox.height() - text.contentBox.height()) / 2;
            }

            text.reflow(targetBox);
        },

        alignToClipBox: function(clipBox) {
            var barLabel = this,
                vertical = barLabel.options.vertical,
                field = vertical ? Y : X,
                start = field + "1",
                end = field + "2",
                text = barLabel.children[0],
                box = text.paddingBox,
                difference;

            if (box[end] < clipBox[start]) {
                difference = clipBox[start] - box[end];
            } else if (clipBox[end] < box[start]){
                difference = clipBox[end] - box[start];
            }

            if (defined(difference)) {
                box[start] += difference;
                box[end] += difference;
                text.reflow(box);
            }
        },

        getViewElements: function(view) {
            var barLabel = this,
                elements = [];
            if (barLabel.options.visible !== false) {
                elements = ChartElement.fn.getViewElements.call(barLabel, view);
            }
            return elements;
        }
    });

    var LegendLabel = Text.extend({
        init: function(item, options) {
            var label = this;

            label.item = item;

            Text.fn.init.call(label, item.text,
                deepExtend({ id: uniqueId(), cursor: { style: POINTER } }, options)
            );

            label.enableDiscovery();
        },

        click: function(widget, e) {
            var args = this.eventArgs(e);

            if (!widget.trigger(LEGEND_ITEM_CLICK, args)) {
                e.preventDefault();
                widget._legendItemClick(args.seriesIndex, args.pointIndex);
            }
        },

        hover: function(widget, e) {
            var args = this.eventArgs(e);

            if (!widget.trigger(LEGEND_ITEM_HOVER, args)) {
                e.preventDefault();
                widget._legendItemHover(args.seriesIndex, args.pointIndex);
            }
        },

        leave: function(widget) {
            widget._unsetActivePoint();
        },

        eventArgs: function(e) {
            var item = this.item;

            return {
                element: $(e.target),
                text: item.text,
                series: item.series,
                seriesIndex: item.series.index,
                pointIndex: item.pointIndex
            };
        }
    });

    var Legend = ChartElement.extend({
        init: function(options) {
            var legend = this;

            ChartElement.fn.init.call(legend, options);

            legend.createLabels();
        },

        options: {
            position: RIGHT,
            items: [],
            labels: {},
            offsetX: 0,
            offsetY: 0,
            margin: getSpacing(10),
            padding: getSpacing(5),
            border: {
                color: BLACK,
                width: 0
            },
            background: "",
            zIndex: 1,
            markers: {
                border: {
                    width: 1
                }
            }
        },

        createLabels: function() {
            var legend = this,
                items = legend.options.items,
                count = items.length,
                i, item;

            for (i = 0; i < count; i++) {
                item = items[i];
                legend.append(new LegendLabel(item, deepExtend({},
                    legend.options.labels, { color: item.labelColor } )));
            }
        },

        reflow: function(targetBox) {
            var legend = this,
                options = legend.options,
                childrenCount = legend.children.length;

            if (childrenCount === 0) {
                legend.box = targetBox.clone();
                return;
            }

            if (options.position == "custom") {
                legend.customLayout(targetBox);
                return;
            }

            if (options.position == TOP || options.position == BOTTOM) {
                legend.horizontalLayout(targetBox);
            } else {
                legend.verticalLayout(targetBox);
            }
        },

        getViewElements: function(view) {
            var legend = this,
                children = legend.children,
                options = legend.options,
                items = options.items,
                count = items.length,
                markerSize = legend.markerSize(),
                group = view.createGroup({ zIndex: options.zIndex }),
                border = options.border || {},
                padding, markerBox, labelBox, color,
                label, box, i;

            append(group.children, ChartElement.fn.getViewElements.call(legend, view));

            for (i = 0; i < count; i++) {
                color = items[i].markerColor;
                label = children[i];
                markerBox = Box2D();
                box = label.box;

                labelBox = labelBox ? labelBox.wrap(box) : box.clone();

                markerBox.x1 = box.x1 - markerSize * 2;
                markerBox.x2 = markerBox.x1 + markerSize;

                if (options.position == TOP || options.position == BOTTOM) {
                    markerBox.y1 = box.y1 + markerSize / 2;
                } else {
                    markerBox.y1 = box.y1 + (box.height() - markerSize) / 2;
                }

                markerBox.y2 = markerBox.y1 + markerSize;

                group.children.push(view.createRect(markerBox, {
                    fill: color,
                    stroke: color,
                    strokeWidth: options.markers.border.width,
                    data: { modelId: label.modelId },
                    cursor: {
                        style: POINTER
                    }
                }));
            }

            if (children.length > 0) {
                padding = getSpacing(options.padding);
                padding.left += markerSize * 2;
                labelBox.pad(padding);
                group.children.unshift(view.createRect(labelBox, {
                    stroke: border.width ? border.color : "",
                    strokeWidth: border.width,
                    dashType: border.dashType,
                    fill: options.background
                }));
            }

            return [ group ];
        },

        verticalLayout: function(targetBox) {
            var legend = this,
                options = legend.options,
                children = legend.children,
                childrenCount = children.length,
                labelBox = children[0].box.clone(),
                margin = getSpacing(options.margin),
                markerSpace = legend.markerSize() * 2,
                offsetX, offsetY, label, i;

            // Position labels below each other
            for (i = 1; i < childrenCount; i++) {
                label = legend.children[i];
                label.box.alignTo(legend.children[i - 1].box, BOTTOM);
                labelBox.wrap(label.box);
            }

            // Vertical center is calculated relative to the container, not the parent!
            if (options.position == LEFT) {
                offsetX = targetBox.x1 + markerSpace + margin.left;
                offsetY = (targetBox.y2 - labelBox.height()) / 2;
                labelBox.x2 += markerSpace + margin.left + margin.right;
            } else {
                offsetX = targetBox.x2 - labelBox.width() - margin.right;
                offsetY = (targetBox.y2 - labelBox.height()) / 2;
                labelBox.translate(offsetX, offsetY);
                labelBox.x1 -= markerSpace + margin.left;
            }

            legend.translateChildren(offsetX + options.offsetX,
                    offsetY + options.offsetY);

            var labelBoxWidth = labelBox.width();
            labelBox.x1 = math.max(targetBox.x1, labelBox.x1);
            labelBox.x2 = labelBox.x1 + labelBoxWidth;

            labelBox.y1 = targetBox.y1;
            labelBox.y2 = targetBox.y2;

            legend.box = labelBox;
        },

        horizontalLayout: function(targetBox) {
            var legend = this,
                options = legend.options,
                children = legend.children,
                childrenCount = children.length,
                box = children[0].box.clone(),
                markerWidth = legend.markerSize() * 3,
                offsetX,
                offsetY,
                margin = getSpacing(options.margin),
                boxWidth = children[0].box.width() + markerWidth,
                plotAreaWidth = targetBox.width(),
                label,
                labelY = 0,
                i;

            // Position labels next to each other
            for (i = 1; i < childrenCount; i++) {
                label = children[i];

                boxWidth += label.box.width() + markerWidth;
                if (boxWidth > plotAreaWidth - markerWidth) {
                    label.box = Box2D(box.x1, box.y2,
                        box.x1 + label.box.width(), box.y2 + label.box.height());
                    boxWidth = label.box.width() + markerWidth;
                    labelY = label.box.y1;
                } else {
                    label.box.alignTo(children[i - 1].box, RIGHT);
                    label.box.y2 = labelY + label.box.height();
                    label.box.y1 = labelY;
                    label.box.translate(markerWidth, 0);
                }
                box.wrap(label.box);
            }

            offsetX = (targetBox.width() - box.width() + markerWidth) / 2;
            if (options.position === TOP) {
                offsetY = targetBox.y1 + margin.top;
                box.y2 = targetBox.y1 + box.height() + margin.top + margin.bottom;
                box.y1 = targetBox.y1;
            } else {
                offsetY = targetBox.y2 - box.height() - margin.bottom;
                box.y1 = targetBox.y2 - box.height() - margin.top - margin.bottom;
                box.y2 = targetBox.y2;
            }

            legend.translateChildren(offsetX + options.offsetX,
                    offsetY + options.offsetY);

            box.x1 = targetBox.x1;
            box.x2 = targetBox.x2;

            legend.box = box;
        },

        customLayout: function (targetBox) {
            var legend = this,
                options = legend.options,
                children = legend.children,
                childrenCount = children.length,
                labelBox = children[0].box.clone(),
                markerWidth = legend.markerSize() * 2,
                i;

            // Position labels next to each other
            for (i = 1; i < childrenCount; i++) {
                labelBox = legend.children[i].box;
                labelBox.alignTo(legend.children[i - 1].box, BOTTOM);
                labelBox.wrap(labelBox);
            }

            legend.translateChildren(options.offsetX + markerWidth, options.offsetY);

            legend.box = targetBox;
        },

        markerSize: function() {
            var legend = this,
                children = legend.children;

            if (children.length > 0) {
                return children[0].box.height() / 2;
            } else {
                return 0;
            }
        }
    });

    var CategoryAxis = Axis.extend({
        init: function(options) {
            var axis = this;

            Axis.fn.init.call(axis, options);

            options = axis.options;
            options.categories = options.categories.slice(0);

            axis._ticks = {};
        },

        options: {
            type: CATEGORY,
            categories: [],
            vertical: false,
            majorGridLines: {
                visible: false,
                width: 1,
                color: BLACK
            },
            zIndex: 1,
            justified: false
        },

        range: function() {
            return { min: 0, max: this.options.categories.length };
        },

        getTickPositions: function(itemsCount) {
            var axis = this,
                options = axis.options,
                vertical = options.vertical,
                justified = options.justified,
                lineBox = axis.lineBox(),
                size = vertical ? lineBox.height() : lineBox.width(),
                intervals = itemsCount - (justified ? 1 : 0),
                step = size / intervals,
                dim = vertical ? Y : X,
                pos = lineBox[dim + 1],
                positions = [],
                i;

            for (i = 0; i < itemsCount; i++) {
                positions.push(round(pos, COORD_PRECISION));
                pos += step;
            }

            if (!justified) {
                positions.push(lineBox[dim + 2]);
            }

            return options.reverse ? positions.reverse() : positions;
        },

        getMajorTickPositions: function() {
            return this.getTicks().majorTicks;
        },

        getMinorTickPositions: function() {
            return this.getTicks().minorTicks;
        },

        getTicks: function() {
            var axis = this,
                cache = axis._ticks,
                options = axis.options,
                count = options.categories.length,
                reverse = options.reverse,
                justified = options.justified,
                lineBox = axis.lineBox(),
                hash;

            hash = lineBox.getHash() + count + reverse + justified;
            if (cache._hash !== hash) {
                cache._hash = hash;
                cache.majorTicks = axis.getTickPositions(count);
                cache.minorTicks = axis.getTickPositions(count * 2);
            }

            return cache;
        },

        getSlot: function(from, to) {
            var axis = this,
                options = axis.options,
                majorTicks = axis.getTicks().majorTicks,
                reverse = options.reverse,
                justified = options.justified,
                valueAxis = options.vertical ? Y : X,
                lineBox = axis.lineBox(),
                lineStart = lineBox[valueAxis + (reverse ? 2 : 1)],
                lineEnd = lineBox[valueAxis + (reverse ? 1 : 2)],
                slotBox = lineBox.clone(),
                intervals = math.max(1, majorTicks.length - (justified ? 0 : 1)),
                p1,
                p2,
                slotSize;

            var singleSlot = !defined(to);

            from = valueOrDefault(from, 0);
            to = valueOrDefault(to, from);
            from = limitValue(from, 0, intervals);
            to = limitValue(to - 1, from, intervals);
            // Fixes transient bug caused by iOS 6.0 JIT
            // (one can never be too sure)
            to = math.max(from, to);

            p1 = from === 0 ? lineStart : (majorTicks[from] || lineEnd);
            p2 = justified ? p1 : majorTicks[to];
            slotSize = to - from;

            if (slotSize > 0 || (from === to)) {
                p2 = majorTicks[to + 1] || lineEnd;
            }

            if (singleSlot && justified) {
                if (from === intervals) {
                    p1 = p2;
                } else {
                    p2 = p1;
                }
            }

            slotBox[valueAxis + 1] = reverse ? p2 : p1;
            slotBox[valueAxis + 2] = reverse ? p1 : p2;

            return slotBox;
        },

        pointCategoryIndex: function(point) {
            var axis = this,
                options = axis.options,
                reverse = options.reverse,
                vertical = options.vertical,
                valueAxis = vertical ? Y : X,
                lineBox = axis.lineBox(),
                lineStart = lineBox[valueAxis + 1],
                lineEnd = lineBox[valueAxis + 2],
                pos = point[valueAxis],
                majorTicks = axis.getMajorTickPositions(),
                diff = MAX_VALUE,
                tickPos, nextTickPos, i, categoryIx;

            if (pos < lineStart || pos > lineEnd) {
                return null;
            }

            for (i = 0; i < majorTicks.length; i++) {
                tickPos = majorTicks[i];
                nextTickPos = majorTicks[i + 1];

                if (!defined(nextTickPos)) {
                    nextTickPos = reverse ? lineStart : lineEnd;
                }

                if (reverse) {
                    tickPos = nextTickPos;
                    nextTickPos = majorTicks[i];
                }

                if (options.justified) {
                    if (pos === nextTickPos) {
                        categoryIx = math.max(0, vertical ? majorTicks.length - i - 1 : i + 1);
                        break;
                    }

                    if (math.abs(pos - tickPos) < diff) {
                        diff = pos - tickPos;
                        categoryIx = i;
                    }
                } else {
                    if (pos >= tickPos && pos <= nextTickPos) {
                        categoryIx = i;
                        break;
                    }
                }
            }

            return categoryIx;
        },

        getCategory: function(point) {
            var index = this.pointCategoryIndex(point);

            if (index === null) {
                return null;
            }
            return this.options.categories[index];
        },

        categoryIndex: function(value) {
            return indexOf(value, this.options.categories);
        },

        translateRange: function(delta) {
            var axis = this,
                options = axis.options,
                lineBox = axis.lineBox(),
                size = options.vertical ? lineBox.height() : lineBox.width(),
                range = options.categories.length,
                scale = size / range,
                offset = round(delta / scale, DEFAULT_PRECISION);

            return {
                min: offset,
                max: range + offset
            };
        },

        scaleRange: function(scale) {
            var axis = this,
                options = axis.options,
                range = options.categories.length,
                delta = scale * range;

            return {
                min: -delta,
                max: range + delta
            };
        },

        labelsCount: function() {
            return this.options.categories.length;
        },

        createAxisLabel: function(index, labelOptions) {
            var axis = this,
                options = axis.options,
                dataItem = options.dataItems ? options.dataItems[index] : null,
                category = valueOrDefault(options.categories[index], ""),
                text = axis.axisLabelText(category, dataItem, labelOptions);

            return new AxisLabel(category, text, index, dataItem, labelOptions);
        },

        shouldRenderNote: function(value) {
            var categories = this.options.categories;

            return categories.length && (categories.length > value && value >= 0);
        }
    });

    var DateCategoryAxis = CategoryAxis.extend({
        init: function(options) {
            var axis = this,
                baseUnit,
                useDefault;

            options = options || {};

            options = deepExtend({
                roundToBaseUnit: true
            }, options, {
                categories: toDate(options.categories),
                min: toDate(options.min),
                max: toDate(options.max)
            });

            if (options.categories && options.categories.length > 0) {
                baseUnit = (options.baseUnit || "").toLowerCase();
                useDefault = baseUnit !== FIT && !inArray(baseUnit, BASE_UNITS);
                if (useDefault) {
                    options.baseUnit = axis.defaultBaseUnit(options);
                }

                if (baseUnit === FIT || options.baseUnitStep === AUTO) {
                    axis.autoBaseUnit(options);
                }

                axis.groupCategories(options);
            } else {
                options.baseUnit = options.baseUnit || DAYS;
            }

            CategoryAxis.fn.init.call(axis, options);
        },

        options: {
            type: DATE,
            labels: {
                dateFormats: DateLabelFormats
            },
            autoBaseUnitSteps: {
                seconds: [1, 2, 5, 15, 30],
                minutes: [1, 2, 5, 15, 30],
                hours: [1, 2, 3],
                days: [1, 2, 3],
                weeks: [1, 2],
                months: [1, 2, 3, 6],
                years: [1, 2, 3, 5, 10, 25, 50]
            },
            maxDateGroups: 10
        },

        shouldRenderNote: function(value) {
            var axis = this,
                range = axis.range(),
                categories = axis.options.categories || [];

            return dateComparer(value, range.min) >= 0 && dateComparer(value, range.max) <= 0 && categories.length;
        },

        parseNoteValue: function(value) {
            return toDate(value);
        },

        translateRange: function(delta) {
            var axis = this,
                options = axis.options,
                baseUnit = options.baseUnit,
                weekStartDay = options.weekStartDay,
                lineBox = axis.lineBox(),
                size = options.vertical ? lineBox.height() : lineBox.width(),
                range = axis.range(),
                scale = size / (range.max - range.min),
                offset = round(delta / scale, DEFAULT_PRECISION),
                from,
                to;

            if (range.min && range.max) {
                from = addTicks(options.min || range.min, offset);
                to = addTicks(options.max || range.max, offset);

                range = {
                    min: addDuration(from, 0, baseUnit, weekStartDay),
                    max: addDuration(to, 0, baseUnit, weekStartDay)
                };
            }

            return range;
        },

        scaleRange: function(delta) {
            var axis = this,
                rounds = math.abs(delta),
                range = axis.range(),
                from = range.min,
                to = range.max,
                step;

            if (range.min && range.max) {
                while (rounds--) {
                    range = dateDiff(from, to);
                    step = math.round(range * 0.1);
                    if (delta < 0) {
                        from = addTicks(from, step);
                        to = addTicks(to, -step);
                    } else {
                        from = addTicks(from, -step);
                        to = addTicks(to, step);
                    }
                }

                range = { min: from, max: to };
            }

            return range;
        },

        defaultBaseUnit: function(options) {
            var categories = options.categories,
                count = defined(categories) ? categories.length : 0,
                categoryIx,
                cat,
                diff,
                minDiff = MAX_VALUE,
                lastCat,
                unit;

            for (categoryIx = 0; categoryIx < count; categoryIx++) {
                cat = categories[categoryIx];

                if (cat && lastCat) {
                    diff = dateDiff(cat, lastCat);
                    if (diff > 0) {
                        minDiff = math.min(minDiff, diff);

                        if (minDiff >= TIME_PER_YEAR) {
                            unit = YEARS;
                        } else if (minDiff >= TIME_PER_MONTH - TIME_PER_DAY * 3) {
                            unit = MONTHS;
                        } else if (minDiff >= TIME_PER_WEEK) {
                            unit = WEEKS;
                        } else if (minDiff >= TIME_PER_DAY) {
                            unit = DAYS;
                        } else if (minDiff >= TIME_PER_HOUR) {
                            unit = HOURS;
                        } else if (minDiff >= TIME_PER_MINUTE) {
                            unit = MINUTES;
                        } else {
                            unit = SECONDS;
                        }
                    }
                }

                lastCat = cat;
            }

            return unit || DAYS;
        },

        _categoryRange: function(categories) {
            var range = categories._range;
            if (!range) {
                range = categories._range = sparseArrayLimits(categories);
            }

            return range;
        },

        range: function(options) {
            options = options || this.options;

            var categories = options.categories,
                autoUnit = options.baseUnit === FIT,
                baseUnit = autoUnit ? BASE_UNITS[0] : options.baseUnit,
                baseUnitStep = options.baseUnitStep || 1,
                min = toTime(options.min),
                max = toTime(options.max),
                categoryLimits = this._categoryRange(categories);

            var minCategory = toTime(categoryLimits.min),
                maxCategory = toTime(categoryLimits.max);

            if (options.roundToBaseUnit) {
                return { min: addDuration(min || minCategory, 0, baseUnit, options.weekStartDay),
                         max: addDuration(max || maxCategory, baseUnitStep, baseUnit, options.weekStartDay) };
            } else {
                return { min: toDate(min || minCategory),
                         max: toDate(max || this._srcMaxDate || maxCategory) };
            }
        },

        autoBaseUnit: function(options) {
            var axis = this,
                range = axis.range(deepExtend({}, options, { baseUnitStep: 1 })),
                autoUnit = options.baseUnit === FIT,
                autoUnitIx = 0,
                baseUnit = autoUnit ? BASE_UNITS[autoUnitIx++] : options.baseUnit,
                span = range.max - range.min,
                units = span / TIME_PER_UNIT[baseUnit],
                totalUnits = units,
                maxDateGroups = options.maxDateGroups || axis.options.maxDateGroups,
                autoBaseUnitSteps = deepExtend(
                    {}, axis.options.autoBaseUnitSteps, options.autoBaseUnitSteps
                ),
                unitSteps,
                step,
                nextStep;

            while (!step || units > maxDateGroups) {
                unitSteps = unitSteps || autoBaseUnitSteps[baseUnit].slice(0);
                nextStep = unitSteps.shift();

                if (nextStep) {
                    step = nextStep;
                    units = totalUnits / step;
                } else if (baseUnit === last(BASE_UNITS)) {
                    step = math.ceil(totalUnits / maxDateGroups);
                    break;
                } else if (autoUnit) {
                    baseUnit = BASE_UNITS[autoUnitIx++] || last(BASE_UNITS);
                    totalUnits = span / TIME_PER_UNIT[baseUnit];
                    unitSteps = null;
                } else {
                    if (units > maxDateGroups) {
                        step = math.ceil(totalUnits / maxDateGroups);
                    }
                    break;
                }
            }

            options.baseUnitStep = step;
            options.baseUnit = baseUnit;
        },

        _timeScale: function() {
            var axis = this,
                range = axis.range(),
                options = axis.options,
                lineBox = axis.lineBox(),
                vertical = options.vertical,
                lineSize = vertical ? lineBox.height() : lineBox.width(),
                timeRange;

            if (options.justified && options._collapse !== false) {
                var categoryLimits = this._categoryRange(options.categories);
                var maxCategory = toTime(categoryLimits.max);
                timeRange = toDate(maxCategory) - range.min;
            } else {
                timeRange = range.max - range.min;
            }

            return lineSize / timeRange;
        },

        getTickPositions: function(count) {
            var axis = this,
                options = axis.options,
                categories = options.categories,
                positions = [];

            if (options.roundToBaseUnit || categories.length === 0) {
                positions = CategoryAxis.fn.getTickPositions.call(axis, count);
            } else {
                var vertical = options.vertical,
                    reverse = options.reverse,
                    lineBox = axis.lineBox(),
                    startTime = categories[0].getTime(),
                    collapse = valueOrDefault(options._collapse, options.justified),
                    divisions = categories.length - (collapse ? 1 : 0),
                    scale = axis._timeScale(),
                    dir = (vertical ? -1 : 1) * (reverse ? -1 : 1),
                    startEdge = dir === 1 ? 1 : 2,
                    endEdge = dir === 1 ? 2 : 1,
                    startPos = lineBox[(vertical ? Y : X) + startEdge],
                    endPos = lineBox[(vertical ? Y : X) + endEdge],
                    pos = startPos,
                    i,
                    timePos;

                for (i = 0; i < divisions; i++) {
                    timePos = categories[i] - startTime;
                    pos = startPos + timePos * scale * dir;
                    positions.push(round(pos, COORD_PRECISION));
                }

                if (last(positions) !== endPos) {
                    positions.push(endPos);
                }
            }

            return positions;
        },

        groupCategories: function(options) {
            var axis = this,
                categories = options.categories,
                maxCategory = toDate(sparseArrayMax(categories)),
                baseUnit = options.baseUnit,
                baseUnitStep = options.baseUnitStep || 1,
                range = axis.range(options),
                max = range.max,
                date,
                nextDate,
                groups = [];

            for (date = range.min; date < max; date = nextDate) {
                groups.push(date);

                nextDate = addDuration(date, baseUnitStep, baseUnit, options.weekStartDay);
                if (nextDate > maxCategory && !options.max) {
                    break;
                }
            }

            if (!options.roundToBaseUnit && !dateEquals(last(groups), max)) {
                if (max < nextDate && options._collapse !== false) {
                    this._srcMaxDate = max;
                } else {
                    groups.push(max);
                }
            }

            options.srcCategories = categories;
            options.categories = groups;
        },

        createAxisLabel: function(index, labelOptions) {
            var options = this.options,
                dataItem = options.dataItems ? options.dataItems[index] : null,
                date = options.categories[index],
                baseUnit = options.baseUnit,
                visible = true,
                unitFormat = labelOptions.dateFormats[baseUnit];

            if (options.justified) {
                var roundedDate = floorDate(date, baseUnit, options.weekStartDay);
                visible = dateEquals(roundedDate, date);
            } else if (!options.roundToBaseUnit) {
                visible = !dateEquals(this.range().max, date);
            }

            if (visible) {
                labelOptions.format = labelOptions.format || unitFormat;
                var text = this.axisLabelText(date, dataItem, labelOptions);
                if (text) {
                    return new AxisLabel(date, text, index, dataItem, labelOptions);
                }
            }
        },

        categoryIndex: function(value, range) {
            var axis = this,
                options = axis.options,
                categories = options.categories,
                equalsRoundedMax,
                index;

            value = toDate(value);
            range = range || axis.range();
            equalsRoundedMax = options.roundToBaseUnit && dateEquals(range.max, value);
            if (!value || (value > range.max) || (value < range.min) || equalsRoundedMax) {
                return -1;
            }

            index = lteDateIndex(value, categories);

            return index;
        },

        getSlot: function(a, b) {
            var axis = this;

            if (typeof a === OBJECT) {
                a = axis.categoryIndex(a);
            }

            if (typeof b === OBJECT) {
                b = axis.categoryIndex(b);
            }

            return CategoryAxis.fn.getSlot.call(axis, a, b);
        }
    });

    var DateValueAxis = Axis.extend({
        init: function(seriesMin, seriesMax, options) {
            var axis = this;

            options = options || {};

            deepExtend(options, {
                min: toDate(options.min),
                max: toDate(options.max),
                axisCrossingValue: toDate(
                    options.axisCrossingValues || options.axisCrossingValue
                )
            });

            options = axis.applyDefaults(toDate(seriesMin), toDate(seriesMax), options);

            Axis.fn.init.call(axis, options);
        },

        options: {
            type: DATE,
            labels: {
                dateFormats: DateLabelFormats
            }
        },

        applyDefaults: function(seriesMin, seriesMax, options) {
            var axis = this,
                min = options.min || seriesMin,
                max = options.max || seriesMax,
                baseUnit = options.baseUnit || axis.timeUnits(max - min),
                baseUnitTime = TIME_PER_UNIT[baseUnit],
                autoMin = floorDate(toTime(min) - 1, baseUnit) || toDate(max),
                autoMax = ceilDate(toTime(max) + 1, baseUnit),
                userMajorUnit = options.majorUnit ? options.majorUnit : undefined,
                majorUnit = userMajorUnit || dataviz.ceil(
                                dataviz.autoMajorUnit(autoMin.getTime(), autoMax.getTime()),
                                baseUnitTime
                            ) / baseUnitTime,
                actualUnits = duration(autoMin, autoMax, baseUnit),
                totalUnits = dataviz.ceil(actualUnits, majorUnit),
                unitsToAdd = totalUnits - actualUnits,
                head = math.floor(unitsToAdd / 2),
                tail = unitsToAdd - head;

            if (!options.baseUnit) {
                delete options.baseUnit;
            }

            return deepExtend({
                    baseUnit: baseUnit,
                    min: addDuration(autoMin, -head, baseUnit),
                    max: addDuration(autoMax, tail, baseUnit),
                    minorUnit: majorUnit / 5
                }, options, {
                    majorUnit: majorUnit
                }
            );
        },

        range: function() {
            var options = this.options;
            return { min: options.min, max: options.max };
        },

        getDivisions: function(stepValue) {
            var options = this.options;

            return math.floor(
                duration(options.min, options.max, options.baseUnit) / stepValue + 1
            );
        },

        getTickPositions: function(step) {
            var axis = this,
                options = axis.options,
                vertical = options.vertical,
                reverse = options.reverse,
                lineBox = axis.lineBox(),
                lineSize = vertical ? lineBox.height() : lineBox.width(),
                timeRange = duration(options.min, options.max, options.baseUnit),
                scale = lineSize / timeRange,
                scaleStep = step * scale,
                divisions = axis.getDivisions(step),
                dir = (vertical ? -1 : 1) * (reverse ? -1 : 1),
                startEdge = dir === 1 ? 1 : 2,
                pos = lineBox[(vertical ? Y : X) + startEdge],
                positions = [],
                i;

            for (i = 0; i < divisions; i++) {
                positions.push(round(pos, COORD_PRECISION));
                pos = pos + scaleStep * dir;
            }

            return positions;
        },

        getMajorTickPositions: function() {
            var axis = this;

            return axis.getTickPositions(axis.options.majorUnit);
        },

        getMinorTickPositions: function() {
            var axis = this;

            return axis.getTickPositions(axis.options.minorUnit);
        },

        getSlot: function(a, b, limit) {
            return NumericAxis.fn.getSlot.call(
                this, toDate(a), toDate(b), limit
            );
        },

        getValue: function(point) {
            var value = NumericAxis.fn.getValue.call(this, point);

            return value !== null ? toDate(value) : null;
        },

        labelsCount: function() {
            return this.getDivisions(this.options.majorUnit);
        },

        createAxisLabel: function(index, labelOptions) {
            var options = this.options,
                offset =  index * options.majorUnit,
                date = addDuration(options.min, offset, options.baseUnit),
                unitFormat = labelOptions.dateFormats[options.baseUnit];

            labelOptions.format = labelOptions.format || unitFormat;

            var text = this.axisLabelText(date, null, labelOptions);
            return new AxisLabel(date, text, index, null, labelOptions);
        },

        timeUnits: function(delta) {
            var unit = HOURS;

            if (delta >= TIME_PER_YEAR) {
                unit = YEARS;
            } else if (delta >= TIME_PER_MONTH) {
                unit = MONTHS;
            } else if (delta >= TIME_PER_WEEK) {
                unit = WEEKS;
            } else if (delta >= TIME_PER_DAY) {
                unit = DAYS;
            }

            return unit;
        },

        translateRange: function(delta) {
            var axis = this,
                options = axis.options,
                baseUnit = options.baseUnit,
                weekStartDay = options.weekStartDay,
                lineBox = axis.lineBox(),
                size = options.vertical ? lineBox.height() : lineBox.width(),
                range = axis.range(),
                scale = size / (range.max - range.min),
                offset = round(delta / scale, DEFAULT_PRECISION),
                from = addTicks(options.min, offset),
                to = addTicks(options.max, offset);

            return {
                min: addDuration(from, 0, baseUnit, weekStartDay),
                max: addDuration(to, 0, baseUnit, weekStartDay)
            };
        },

        scaleRange: function(delta) {
            var axis = this,
                options = axis.options,
                rounds = math.abs(delta),
                from = options.min,
                to = options.max,
                range,
                step;

            while (rounds--) {
                range = dateDiff(from, to);
                step = math.round(range * 0.1);
                if (delta < 0) {
                    from = addTicks(from, step);
                    to = addTicks(to, -step);
                } else {
                    from = addTicks(from, -step);
                    to = addTicks(to, step);
                }
            }

            return { min: from, max: to };
        },

        shouldRenderNote: function(value) {
            var range = this.range();

            return dateComparer(value, range.min) >= 0 && dateComparer(value, range.max) <= 0;
        }
    });

    var ClusterLayout = ChartElement.extend({
        options: {
            vertical: false,
            gap: 0,
            spacing: 0
        },

        reflow: function(box) {
            var cluster = this,
                options = cluster.options,
                vertical = options.vertical,
                axis = vertical ? Y : X,
                children = cluster.children,
                gap = options.gap,
                spacing = options.spacing,
                count = children.length,
                slots = count + gap + (spacing * (count - 1)),
                slotSize = (vertical ? box.height() : box.width()) / slots,
                position = box[axis + 1] + slotSize * (gap / 2),
                childBox,
                i;

            for (i = 0; i < count; i++) {
                childBox = (children[i].box || box).clone();

                childBox[axis + 1] = position;
                childBox[axis + 2] = position + slotSize;

                children[i].reflow(childBox);
                if (i < count - 1) {
                    position += (slotSize * spacing);
                }

                position += slotSize;
            }
        }
    });

    var StackWrap = ChartElement.extend({
        options: {
            vertical: true
        },

        reflow: function(targetBox) {
            var options = this.options,
                vertical = options.vertical,
                positionAxis = vertical ? X : Y,
                stackAxis = vertical ? Y : X,
                stackBase = targetBox[stackAxis + 2],
                children = this.children,
                box = this.box = new Box2D(),
                childrenCount = children.length,
                i;

            for (i = 0; i < childrenCount; i++) {
                var currentChild = children[i],
                    childBox;
                if (currentChild.visible !== false) {
                    childBox = currentChild.box.clone();
                    childBox.snapTo(targetBox, positionAxis);
                    if (currentChild.options) {
                        // TODO: Remove stackBase and fix BarAnimation
                        currentChild.options.stackBase = stackBase;
                    }

                    if (i === 0) {
                        box = this.box = childBox.clone();
                    }

                    currentChild.reflow(childBox);
                    box.wrap(childBox);
                }
            }
        }
    });

    var PointEventsMixin = {
        click: function(chart, e) {
            var point = this;

            chart.trigger(SERIES_CLICK, {
                value: point.value,
                percentage: point.percentage,
                category: point.category,
                series: point.series,
                dataItem: point.dataItem,
                element: $(e.target)
            });
        },

        hover: function(chart, e) {
            var point = this;

            chart.trigger(SERIES_HOVER, {
                value: point.value,
                percentage: point.percentage,
                category: point.category,
                series: point.series,
                dataItem: point.dataItem,
                element: $(e.target)
            });
        }
    };

    var NoteMixin = {
        createNote: function() {
            var element = this,
                options = element.options.notes,
                text = element.noteText || options.label.text;

            if (options.visible !== false && defined(text) && text !== null) {
                element.note = new Note(
                    element.value,
                    text,
                    element.dataItem,
                    element.category,
                    element.series,
                    element.options.notes
                );
                element.append(element.note);
            }
        }
    };

    var Bar = ChartElement.extend({
        init: function(value, options) {
            var bar = this;

            ChartElement.fn.init.call(bar);

            bar.options = options;
            bar.color = options.color || WHITE;
            bar.aboveAxis = valueOrDefault(bar.options.aboveAxis, true);
            bar.value = value;
            bar.id = uniqueId();
            bar.enableDiscovery();
        },

        defaults: {
            border: {
                width: 1
            },
            vertical: true,
            overlay: {
                gradient: GLASS
            },
            labels: {
                visible: false
            },
            animation: {
                type: BAR
            },
            opacity: 1,
            notes: {
                label: {}
            }
        },

        render: function() {
            var bar = this,
                value = bar.value,
                options = bar.options,
                labels = options.labels,
                labelText = value !== null ? value : "",
                labelTemplate;

            if (bar._rendered) {
                return;
            } else {
                bar._rendered = true;
            }

            if (labels.visible) {
                if (labels.template) {
                    labelTemplate = template(labels.template);
                    labelText = labelTemplate({
                        dataItem: bar.dataItem,
                        category: bar.category,
                        value: bar.value,
                        percentage: bar.percentage,
                        series: bar.series
                    });
                } else if (labels.format) {
                    labelText = autoFormat(labels.format, labelText);
                }
                bar.label = new BarLabel(labelText,
                        deepExtend({
                            vertical: options.vertical,
                            id: uniqueId()
                        },
                        options.labels
                    ));
                bar.append(bar.label);
            }

            bar.createNote();

            if (bar.errorBar) {
                bar.append(bar.errorBar);
            }
        },

        reflow: function(targetBox) {
            this.render();

            var bar = this,
                options = bar.options,
                label = bar.label;

            bar.box = targetBox;

            if (label) {
                label.options.aboveAxis = bar.aboveAxis;
                label.reflow(targetBox);
            }

            if (bar.note) {
                bar.note.reflow(targetBox);
            }

            if(bar.errorBars){
                for(var i = 0; i < bar.errorBars.length;i++){
                    bar.errorBars[i].reflow(targetBox);
                }
            }
        },

        getViewElements: function(view) {
            var bar = this,
                options = bar.options,
                vertical = options.vertical,
                border = options.border.width > 0 ? {
                    stroke: bar.getBorderColor(),
                    strokeWidth: options.border.width,
                    strokeOpacity: options.border.opacity,
                    dashType: options.border.dashType
                } : {},
                box = bar.box,
                rectStyle = deepExtend({
                    id: bar.id,
                    fill: bar.color,
                    fillOpacity: options.opacity,
                    strokeOpacity: options.opacity,
                    vertical: options.vertical,
                    aboveAxis: bar.aboveAxis,
                    stackBase: options.stackBase,
                    animation: options.animation,
                    data: { modelId: bar.modelId }
                }, border),
                elements = [];
            if (bar.visible !== false) {
                if (box.width() > 0 && box.height() > 0) {
                    if (options.overlay) {
                        rectStyle.overlay = deepExtend({
                            rotation: vertical ? 0 : 90
                        }, options.overlay);
                    }

                    elements.push(view.createRect(box, rectStyle));
                }

                append(elements, ChartElement.fn.getViewElements.call(bar, view));
            }

            return elements;
        },

        highlightOverlay: function(view, options) {
            var bar = this,
                box = bar.box;

            options = deepExtend({ data: { modelId: bar.modelId } }, options);
            return view.createRect(box, options);
        },

        getBorderColor: function() {
            var bar = this,
                options = bar.options,
                color = bar.color,
                border = options.border,
                borderColor = border.color,
                brightness = border._brightness || BAR_BORDER_BRIGHTNESS;

            if (!defined(borderColor)) {
                borderColor =
                    new Color(color).brightness(brightness).toHex();
            }

            return borderColor;
        },

        tooltipAnchor: function(tooltipWidth, tooltipHeight) {
            var bar = this,
                options = bar.options,
                box = bar.box,
                vertical = options.vertical,
                aboveAxis = bar.aboveAxis,
                clipBox = bar.owner.pane.clipBox() || box,
                x,
                y;

            if (vertical) {
                x = box.x2 + TOOLTIP_OFFSET;
                y = aboveAxis ? math.max(box.y1, clipBox.y1) : math.min(box.y2, clipBox.y2) - tooltipHeight;
            } else {
                var x1 = math.max(box.x1, clipBox.x1),
                    x2 = math.min(box.x2, clipBox.x2);
                if (options.isStacked) {
                    x = aboveAxis ? x2 - tooltipWidth : x1;
                    y = box.y1 - tooltipHeight - TOOLTIP_OFFSET;
                } else {
                    x = aboveAxis ? x2 + TOOLTIP_OFFSET : x1 - tooltipWidth - TOOLTIP_OFFSET;
                    y = box.y1;
                }
            }

            return new Point2D(x, y);
        },

        formatValue: function(format) {
            var point = this;

            return point.owner.formatPointValue(point, format);
        }
    });
    deepExtend(Bar.fn, PointEventsMixin);
    deepExtend(Bar.fn, NoteMixin);

    var ErrorRangeCalculator = function(errorValue, series, field) {
        var that = this;
        that.errorValue = errorValue;
        that.initGlobalRanges(errorValue, series, field);
    };

    ErrorRangeCalculator.prototype = ErrorRangeCalculator.fn = {
        percentRegex: /percent(?:\w*)\((\d+)\)/,
        standardDeviationRegex: new RegExp("^" + STD_DEV + "(?:\\((\\d+(?:\\.\\d+)?)\\))?$"),

        initGlobalRanges: function(errorValue, series, field) {
            var that = this,
                data = series.data,
                deviationMatch = that.standardDeviationRegex.exec(errorValue);

            if (deviationMatch) {
                that.valueGetter = that.createValueGetter(series, field);
                var average = that.getAverage(data),
                    deviation = that.getStandardDeviation(data, average, false),
                    multiple = deviationMatch[1] ? parseFloat(deviationMatch[1]) : 1,
                    errorRange = {low: average - deviation * multiple, high: average + deviation * multiple};
                that.globalRange = function() {
                    return errorRange;
                };
            } else if (errorValue.indexOf && errorValue.indexOf(STD_ERR) >= 0) {
                that.valueGetter = that.createValueGetter(series, field);
                var standardError = that.getStandardError(data);
                that.globalRange = function(value) {
                    return {low: value - standardError, high: value + standardError};
                };
            }
        },

        createValueGetter: function(series, field) {
            var data = series.data,
                binder = SeriesBinder.current,
                valueFields = binder.valueFields(series),
                item = defined(data[0]) ? data[0] : {},
                idx,
                srcValueFields,
                valueGetter;

            if (isArray(item)) {
                idx = field ? indexOf(field, valueFields): 0;
                valueGetter = getter("[" + idx + "]");
            } else if (isNumber(item)) {
                valueGetter = getter();
            } else if (typeof item === OBJECT) {
                srcValueFields = binder.sourceFields(series, valueFields);
                valueGetter = getter(srcValueFields[indexOf(field, valueFields)]);
            }

            return valueGetter;
        },

        getErrorRange: function(pointValue) {
            var that = this,
                errorValue = that.errorValue,
                low,
                high,
                value;


            if (!defined(errorValue)) {
                return;
            }

            if (that.globalRange) {
                return that.globalRange(pointValue);
            }

            if (isArray(errorValue)) {
                low = pointValue - errorValue[0];
                high = pointValue + errorValue[1];
            } else if (isNumber(value = parseFloat(errorValue))) {
                low = pointValue - value;
                high = pointValue + value;
            } else if ((value = that.percentRegex.exec(errorValue))) {
                var percentValue = pointValue * (parseFloat(value[1]) / 100);
                low = pointValue - math.abs(percentValue);
                high = pointValue + math.abs(percentValue);
            } else {
                throw new Error("Invalid ErrorBar value: " + errorValue);
            }

            return {low: low, high: high};
        },

        getStandardError: function(data) {
            return this.getStandardDeviation(data, this.getAverage(data), true) / math.sqrt(data.length);
        },

        getStandardDeviation: function(data, average, isSample) {
            var squareDifferenceSum = 0,
                length = data.length,
                total = isSample ? length - 1 : length;

            for (var i = 0; i < length; i++) {
                squareDifferenceSum += math.pow(this.valueGetter(data[i]) - average, 2);
            }

            return math.sqrt(squareDifferenceSum / total);
        },

        getAverage: function(data) {
            var sum = 0,
                length = data.length;

            for(var i = 0; i < length; i++){
                sum += this.valueGetter(data[i]);
            }

            return sum / length;
        }
    };

    var CategoricalChart = ChartElement.extend({
        init: function(plotArea, options) {
            var chart = this;

            ChartElement.fn.init.call(chart, options);

            chart.plotArea = plotArea;
            chart.categoryAxis = plotArea.seriesCategoryAxis(options.series[0]);

            // Value axis ranges grouped by axis name, e.g.:
            // primary: { min: 0, max: 1 }
            chart.valueAxisRanges = {};

            chart.points = [];
            chart.categoryPoints = [];
            chart.seriesPoints = [];
            chart.seriesOptions = [];
            chart._evalSeries = [];

            chart.render();
        },

        options: {
            series: [],
            invertAxes: false,
            isStacked: false,
            clip: true
        },

        render: function() {
            var chart = this;
            chart.traverseDataPoints(proxy(chart.addValue, chart));
        },

        pointOptions: function(series, seriesIx) {
            var options = this.seriesOptions[seriesIx];
            if (!options) {
                var defaults = this.pointType().fn.defaults;
                this.seriesOptions[seriesIx] = options = deepExtend({ }, defaults, {
                    vertical: !this.options.invertAxes
                }, series);
            }

            return options;
        },

        plotValue: function(point) {
            if (this.options.isStacked100 && isNumber(point.value)) {
                var categoryIx = point.categoryIx;
                var categoryPts = this.categoryPoints[categoryIx];
                var categorySum = 0;

                for (var i = 0; i < categoryPts.length; i++) {
                    var other = categoryPts[i];
                    var stack = point.series.stack;
                    var otherStack = other.series.stack;

                    if ((stack && otherStack) && stack.group !== otherStack.group) {
                        continue;
                    }

                    if (isNumber(other.value)) {
                        categorySum += math.abs(other.value);
                    }
                }

                return point.value / categorySum;
            } else {
                return point.value;
            }
        },

        plotRange: function(point, startValue) {
            var categoryIx = point.categoryIx;
            var categoryPts = this.categoryPoints[categoryIx];

            if (this.options.isStacked) {
                startValue = startValue || 0;
                var plotValue = this.plotValue(point);
                var positive = plotValue > 0;
                var prevValue = startValue;
                var isStackedBar = false;

                for (var i = 0; i < categoryPts.length; i++) {
                    var other = categoryPts[i];

                    if (point === other) {
                        break;
                    }

                    var stack = point.series.stack;
                    var otherStack = other.series.stack;
                    if (stack && otherStack) {
                        if (typeof stack === STRING && stack !== otherStack) {
                            continue;
                        }

                        if (stack.group && stack.group !== otherStack.group) {
                            continue;
                        }
                    }

                    var otherValue = this.plotValue(other);
                    if ((otherValue > 0 && positive) ||
                        (otherValue < 0 && !positive)) {
                        prevValue += otherValue;
                        plotValue += otherValue;
                        isStackedBar = true;
                    }
                }

                if (isStackedBar) {
                    prevValue -= startValue;
                }

                return [prevValue, plotValue];
            }

            var series = point.series;
            var valueAxis = this.seriesValueAxis(series);
            var axisCrossingValue = this.categoryAxisCrossingValue(valueAxis);

            return [axisCrossingValue, point.value || axisCrossingValue];
        },

        plotLimits: function() {
            var min = MAX_VALUE;
            var max = MIN_VALUE;

            for (var i = 0; i < this.categoryPoints.length; i++) {
                var categoryPts = this.categoryPoints[i];

                for (var pIx = 0; pIx < categoryPts.length; pIx++) {
                    var point = categoryPts[pIx];
                    if (point) {
                        var to = this.plotRange(point, 0)[1];
                        if (defined(to)) {
                            max = math.max(max, to);
                            min = math.min(min, to);
                        }
                    }
                }
            }

            return { min: min, max: max };
        },

        computeAxisRanges: function() {
            var chart = this,
                isStacked = chart.options.isStacked,
                axisName, limits;

            if (isStacked) {
                axisName = chart.options.series[0].axis;
                limits = chart.plotLimits();
                if (chart.errorTotals) {
                    limits.min = math.min(limits.min, sparseArrayMin(chart.errorTotals.negative));
                    limits.max = math.max(limits.max, sparseArrayMax(chart.errorTotals.positive));
                }

                chart.valueAxisRanges[axisName] = limits;
            }
        },

        addErrorBar: function(point, data, categoryIx) {
            var chart = this,
                value = point.value,
                series = point.series,
                seriesIx = point.seriesIx,
                errorBars = point.options.errorBars,
                errorRange,
                lowValue = data.fields[ERROR_LOW_FIELD],
                highValue = data.fields[ERROR_HIGH_FIELD];

            if (isNumber(lowValue) &&
                isNumber(highValue)) {
                errorRange = {low: lowValue, high: highValue};
            } else if (errorBars && defined(errorBars.value)) {
                chart.seriesErrorRanges = chart.seriesErrorRanges || [];
                chart.seriesErrorRanges[seriesIx] = chart.seriesErrorRanges[seriesIx] ||
                    new ErrorRangeCalculator(errorBars.value, series, VALUE);

                errorRange = chart.seriesErrorRanges[seriesIx].getErrorRange(value);
            }

            if (errorRange) {
                point.low = errorRange.low;
                point.high = errorRange.high;
                chart.addPointErrorBar(point, categoryIx);
            }
        },

        addPointErrorBar: function(point, categoryIx) {
            var chart = this,
                series = point.series,
                low = point.low,
                high = point.high,
                isVertical = !chart.options.invertAxes,
                options = point.options.errorBars,
                errorBar,
                stackedErrorRange;

            if (chart.options.isStacked) {
                stackedErrorRange = chart.stackedErrorRange(point, categoryIx);
                low = stackedErrorRange.low;
                high = stackedErrorRange.high;
            } else {
                chart.updateRange({value: low}, categoryIx, series);
                chart.updateRange({value: high}, categoryIx, series);
            }

            errorBar = new CategoricalErrorBar(low, high, isVertical, chart, series, options);
            point.errorBars = [errorBar];
            point.append(errorBar);
        },

        stackedErrorRange: function(point, categoryIx) {
            var chart = this,
                value = point.value,
                plotValue = chart.plotRange(point, 0)[1] - point.value,
                low = point.low + plotValue,
                high = point.high + plotValue;

            chart.errorTotals = chart.errorTotals || {positive: [], negative: []};

            if (low < 0) {
                chart.errorTotals.negative[categoryIx] =  math.min(chart.errorTotals.negative[categoryIx] || 0, low);
            }

            if (high > 0) {
                chart.errorTotals.positive[categoryIx] =  math.max(chart.errorTotals.positive[categoryIx] || 0, high);
            }

            return {low: low, high: high};
        },

        addValue: function(data, category, categoryIx, series, seriesIx) {
            var chart = this,
                categoryPoints = chart.categoryPoints[categoryIx],
                seriesPoints = chart.seriesPoints[seriesIx],
                point;

            if (!categoryPoints) {
                chart.categoryPoints[categoryIx] = categoryPoints = [];
            }

            if (!seriesPoints) {
                chart.seriesPoints[seriesIx] = seriesPoints = [];
            }

            chart.updateRange(data.valueFields, categoryIx, series);

            point = chart.createPoint(data, category, categoryIx, series, seriesIx);
            if (point) {
                point.category = category;
                point.categoryIx = categoryIx;
                point.series = series;
                point.seriesIx = seriesIx;
                point.owner = chart;
                point.dataItem = series.data[categoryIx];
                point.noteText = data.fields.noteText;
                chart.addErrorBar(point, data, categoryIx);
            }

            chart.points.push(point);
            seriesPoints.push(point);
            categoryPoints.push(point);
        },

        evalPointOptions: function(options, value, category, categoryIx, series, seriesIx) {
            var state = { defaults: series._defaults, excluded: ["data", "aggregate", "_events", "tooltip"] };

            var doEval = this._evalSeries[seriesIx];
            if (!defined(doEval)) {
                this._evalSeries[seriesIx] = doEval = evalOptions(options, {}, state, true);
            }

            if (doEval) {
                options = deepExtend({}, options);
                evalOptions(options, {
                    value: value,
                    category: category,
                    index: categoryIx,
                    series: series,
                    dataItem: series.data[categoryIx]
                }, state);
            }

            return options;
        },

        updateRange: function(data, categoryIx, series) {
            var chart = this,
                axisName = series.axis,
                value = data.value,
                axisRange = chart.valueAxisRanges[axisName];

            if (isFinite(value) && value !== null) {
                axisRange = chart.valueAxisRanges[axisName] =
                    axisRange || { min: MAX_VALUE, max: MIN_VALUE };

                axisRange.min = math.min(axisRange.min, value);
                axisRange.max = math.max(axisRange.max, value);
            }
        },

        seriesValueAxis: function(series) {
            var plotArea = this.plotArea,
                axisName = series.axis,
                axis = axisName ?
                    plotArea.namedValueAxes[axisName] :
                    plotArea.valueAxis;

            if (!axis) {
                throw new Error("Unable to locate value axis with name " + axisName);
            }

            return axis;
        },

        reflow: function(targetBox) {
            var chart = this,
                pointIx = 0,
                categorySlots = chart.categorySlots = [],
                chartPoints = chart.points,
                categoryAxis = chart.categoryAxis,
                value, valueAxis, axisCrossingValue,
                point;

            chart.traverseDataPoints(function(data, category, categoryIx, currentSeries) {
                value = chart.pointValue(data);

                valueAxis = chart.seriesValueAxis(currentSeries);
                axisCrossingValue = chart.categoryAxisCrossingValue(valueAxis);
                point = chartPoints[pointIx++];

                var categorySlot = categorySlots[categoryIx];
                if (!categorySlot) {
                    categorySlots[categoryIx] = categorySlot =
                        chart.categorySlot(categoryAxis, categoryIx, valueAxis);
                }

                if (point) {
                    var plotRange = chart.plotRange(point, valueAxis.startValue());
                    var valueSlot = valueAxis.getSlot(plotRange[0], plotRange[1], !chart.options.clip);
                    if (valueSlot) {
                        var pointSlot = chart.pointSlot(categorySlot, valueSlot);
                        var aboveAxis = valueAxis.options.reverse ?
                                            value < axisCrossingValue : value >= axisCrossingValue;

                        point.aboveAxis = aboveAxis;
                        if (chart.options.isStacked100) {
                            point.percentage = chart.plotValue(point);
                        }

                        chart.reflowPoint(point, pointSlot);
                    } else {
                        point.visible = false;
                    }
                }
            });

            chart.reflowCategories(categorySlots);

            chart.box = targetBox;
        },

        categoryAxisCrossingValue: function(valueAxis) {
            var categoryAxis = this.categoryAxis,
                options = valueAxis.options,
                crossingValues = [].concat(
                    options.axisCrossingValues || options.axisCrossingValue
                );

            return crossingValues[categoryAxis.axisIndex || 0] || 0;
        },

        reflowPoint: function(point, pointSlot) {
            point.reflow(pointSlot);
        },

        reflowCategories: function() { },

        pointSlot: function(categorySlot, valueSlot) {
            var chart = this,
                options = chart.options,
                invertAxes = options.invertAxes,
                slotX = invertAxes ? valueSlot : categorySlot,
                slotY = invertAxes ? categorySlot : valueSlot;

            return new Box2D(slotX.x1, slotY.y1, slotX.x2, slotY.y2);
        },

        categorySlot: function(categoryAxis, categoryIx) {
            return categoryAxis.getSlot(categoryIx);
        },

        traverseDataPoints: function(callback) {
            var chart = this,
                options = chart.options,
                series = options.series,
                categories = chart.categoryAxis.options.categories || [],
                count = categoriesCount(series),
                categoryIx,
                seriesIx,
                pointData,
                currentCategory,
                currentSeries,
                seriesCount = series.length;

            for (categoryIx = 0; categoryIx < count; categoryIx++) {
                for (seriesIx = 0; seriesIx < seriesCount; seriesIx++) {
                    currentSeries = series[seriesIx];
                    currentCategory = categories[categoryIx];
                    pointData = SeriesBinder.current.bindPoint(currentSeries, categoryIx);

                    callback(pointData, currentCategory, categoryIx, currentSeries, seriesIx);
                }
            }
        },

        formatPointValue: function(point, format) {
            return autoFormat(format, point.value);
        },

        pointValue: function(data) {
            return data.valueFields.value;
        }
    });


    var BarChart = CategoricalChart.extend({
        init: function(plotArea, options) {
            var chart = this;

            CategoricalChart.fn.init.call(chart, plotArea, options);
        },

        render: function() {
            var chart = this;

            CategoricalChart.fn.render.apply(chart);
            chart.computeAxisRanges();
        },

        pointType: function() {
            return Bar;
        },

        clusterType: function() {
            return ClusterLayout;
        },

        stackType: function() {
            return StackWrap;
        },

        plotLimits: function() {
            var limits = CategoricalChart.fn.plotLimits.call(this);
            limits.min = math.min(0, limits.min);
            limits.max = math.max(0, limits.max);

            return limits;
        },

        createPoint: function(data, category, categoryIx, series, seriesIx) {
            var chart = this,
                value = data.valueFields.value,
                options = chart.options,
                children = chart.children,
                isStacked = chart.options.isStacked,
                point,
                pointType = chart.pointType(),
                pointOptions,
                cluster,
                clusterType = chart.clusterType();

            pointOptions = this.pointOptions(series, seriesIx);

            var labelOptions = pointOptions.labels;
            if (isStacked) {
                if (labelOptions.position == OUTSIDE_END) {
                    labelOptions.position = INSIDE_END;
                }
            }

            pointOptions.isStacked = isStacked;

            var color = data.fields.color || series.color;
            if (value < 0 && pointOptions.negativeColor) {
                color = pointOptions.negativeColor;
            }

            pointOptions = chart.evalPointOptions(
                pointOptions, value, category, categoryIx, series, seriesIx
            );

            if (kendo.isFunction(series.color)) {
                color = pointOptions.color;
            }

            point = new pointType(value, pointOptions);
            point.color = color;

            cluster = children[categoryIx];
            if (!cluster) {
                cluster = new clusterType({
                    vertical: options.invertAxes,
                    gap: options.gap,
                    spacing: options.spacing
                });
                chart.append(cluster);
            }

            if (isStacked) {
               var stackWrap = chart.getStackWrap(series, cluster);
               stackWrap.append(point);
            } else {
                cluster.append(point);
            }

            return point;
        },

        getStackWrap: function(series, cluster) {
            var stack = series.stack;
            var stackGroup = stack ? stack.group || stack : stack;

            var wraps = cluster.children;
            var stackWrap;
            if (typeof stackGroup === STRING) {
                for (var i = 0; i < wraps.length; i++) {
                    if (wraps[i]._stackGroup === stackGroup) {
                        stackWrap = wraps[i];
                        break;
                    }
                }
            } else {
                stackWrap = wraps[0];
            }

            if (!stackWrap) {
                var stackType = this.stackType();
                stackWrap = new stackType({
                    vertical: !this.options.invertAxes
                });
                stackWrap._stackGroup = stackGroup;
                cluster.append(stackWrap);
            }

            return stackWrap;
        },

        categorySlot: function(categoryAxis, categoryIx, valueAxis) {
            var chart = this,
                options = chart.options,
                categorySlot = categoryAxis.getSlot(categoryIx),
                startValue = valueAxis.startValue(),
                stackAxis, zeroSlot;

            if (options.isStacked) {
                zeroSlot = valueAxis.getSlot(startValue, startValue, true);
                stackAxis = options.invertAxes ? X : Y;
                categorySlot[stackAxis + 1] = categorySlot[stackAxis + 2] = zeroSlot[stackAxis + 1];
            }

            return categorySlot;
        },

        reflowCategories: function(categorySlots) {
            var chart = this,
                children = chart.children,
                childrenLength = children.length,
                i;

            for (i = 0; i < childrenLength; i++) {
                children[i].reflow(categorySlots[i]);
            }
        }
    });

    var BulletChart = CategoricalChart.extend({
        init: function(plotArea, options) {
            var chart = this;

            chart.wrapData(options);

            CategoricalChart.fn.init.call(chart, plotArea, options);
        },

        wrapData: function(options) {
            var series = options.series,
                i, data, seriesItem;

            for (i = 0; i < series.length; i++) {
                seriesItem = series[i];
                data = seriesItem.data;
                if (data && !isArray(data[0]) && typeof(data[0]) != OBJECT) {
                    seriesItem.data = [data];
                }
            }
        },

        reflowCategories: function(categorySlots) {
            var chart = this,
                children = chart.children,
                childrenLength = children.length,
                i;

            for (i = 0; i < childrenLength; i++) {
                children[i].reflow(categorySlots[i]);
            }
        },

        plotRange: function(point) {
            var series = point.series;
            var valueAxis = this.seriesValueAxis(series);
            var axisCrossingValue = this.categoryAxisCrossingValue(valueAxis);

            return [axisCrossingValue, point.value.current || axisCrossingValue];
        },

        createPoint: function(data, category, categoryIx, series, seriesIx) {
            var chart = this,
                value = data.valueFields,
                options = chart.options,
                children = chart.children,
                bullet,
                bulletOptions,
                cluster;

            bulletOptions = deepExtend({
                vertical: !options.invertAxes,
                overlay: series.overlay,
                categoryIx: categoryIx,
                invertAxes: options.invertAxes
            }, series);

            bulletOptions = chart.evalPointOptions(
                bulletOptions, value, category, categoryIx, series, seriesIx
            );

            bullet = new Bullet(value, bulletOptions);

            cluster = children[categoryIx];
            if (!cluster) {
                cluster = new ClusterLayout({
                    vertical: options.invertAxes,
                    gap: options.gap,
                    spacing: options.spacing
                });
                chart.append(cluster);
            }

            cluster.append(bullet);

            return bullet;
        },

        updateRange: function(value, categoryIx, series) {
            var chart = this,
                axisName = series.axis,
                current = value.current,
                target = value.target,
                axisRange = chart.valueAxisRanges[axisName];

            if (defined(current) && !isNaN(current) && defined(target && !isNaN(target))) {
                axisRange = chart.valueAxisRanges[axisName] =
                    axisRange || { min: MAX_VALUE, max: MIN_VALUE };

                axisRange.min = math.min.apply(math, [axisRange.min, current, target]);
                axisRange.max = math.max.apply(math, [axisRange.max, current, target]);
            }
        },

        formatPointValue: function(point, format) {
            return autoFormat(format, point.value.current, point.value.target);
        },

        pointValue: function(data) {
            return data.valueFields.current;
        }
    });

    var Bullet = ChartElement.extend({
        init: function(value, options) {
            var bullet = this;

            ChartElement.fn.init.call(bullet, options);

            bullet.value = value;
            bullet.aboveAxis = bullet.options.aboveAxis;
            bullet.id = uniqueId();
            bullet.enableDiscovery();
        },

        options: {
            color: WHITE,
            border: {
                width: 1
            },
            vertical: false,
            animation: {
                type: BAR
            },
            opacity: 1,
            target: {
                shape: "",
                border: {
                    width: 0,
                    color: "green"
                },
                line: {
                    width: 2
                }
            },
            tooltip: {
                format: "Current: {0}</br>Target: {1}"
            }
        },

        render: function() {
            var bullet = this,
                options = bullet.options;

            if (!bullet._rendered) {
                bullet._rendered = true;

                if (defined(bullet.value.target)) {
                    bullet.target = new Target({
                        type: options.target.shape,
                        background: options.target.color || options.color,
                        opacity: options.opacity,
                        zIndex: options.zIndex,
                        border: options.target.border,
                        vAlign: TOP,
                        align: RIGHT
                    });
                    bullet.target.id = bullet.id;

                    bullet.append(bullet.target);
                }

                bullet.createNote();
            }
        },

        reflow: function(box) {
            this.render();

            var bullet = this,
                options = bullet.options,
                chart = bullet.owner,
                target = bullet.target,
                invertAxes = options.invertAxes,
                valueAxis = chart.seriesValueAxis(bullet.options),
                categorySlot = chart.categorySlot(chart.categoryAxis, options.categoryIx, valueAxis),
                targetValueSlot = valueAxis.getSlot(bullet.value.target),
                targetSlotX = invertAxes ? targetValueSlot : categorySlot,
                targetSlotY = invertAxes ? categorySlot : targetValueSlot,
                targetSlot;

            if (target) {
                targetSlot = new Box2D(
                    targetSlotX.x1, targetSlotY.y1,
                    targetSlotX.x2, targetSlotY.y2
                );
                target.options.height = invertAxes ? targetSlot.height() : options.target.line.width;
                target.options.width = invertAxes ? options.target.line.width : targetSlot.width();
                target.reflow(targetSlot);
            }

            if (bullet.note) {
                bullet.note.reflow(box);
            }

            bullet.box = box;
        },

        getViewElements: function(view) {
            var bullet = this,
                options = bullet.options,
                vertical = options.vertical,
                border = options.border.width > 0 ? {
                    stroke: options.border.color || options.color,
                    strokeWidth: options.border.width,
                    dashType: options.border.dashType
                } : {},
                box = bullet.box,
                rectStyle = deepExtend({
                    id: bullet.id,
                    fill: options.color,
                    fillOpacity: options.opacity,
                    strokeOpacity: options.opacity,
                    vertical: options.vertical,
                    aboveAxis: bullet.aboveAxis,
                    animation: options.animation,
                    data: { modelId: bullet.modelId }
                }, border),
                elements = [];

            if (box.width() > 0 && box.height() > 0) {
                if (options.overlay) {
                    rectStyle.overlay = deepExtend({
                        rotation: vertical ? 0 : 90
                    }, options.overlay);
                }

                elements.push(view.createRect(box, rectStyle));
            }

            append(elements, ChartElement.fn.getViewElements.call(bullet, view));

            return elements;
        },

        tooltipAnchor: function(tooltipWidth, tooltipHeight) {
            var bar = this,
                options = bar.options,
                box = bar.box,
                vertical = options.vertical,
                aboveAxis = bar.aboveAxis,
                x, y;

            if (vertical) {
                x = box.x2 + TOOLTIP_OFFSET;
                y = aboveAxis ? box.y1 : box.y2 - tooltipHeight;
            } else {
                if (options.isStacked) {
                    x = aboveAxis ? box.x2 - tooltipWidth : box.x1;
                    y = box.y1 - tooltipHeight - TOOLTIP_OFFSET;
                } else {
                    x = aboveAxis ? box.x2 + TOOLTIP_OFFSET : box.x1 - tooltipWidth - TOOLTIP_OFFSET;
                    y = box.y1;
                }
            }

            return new Point2D(x, y);
        },

        highlightOverlay: function(view, options){
            var bullet = this,
                box = bullet.box;

            options = deepExtend({ data: { modelId: bullet.modelId } }, options);

            return view.createRect(box, options);
        },

        formatValue: function(format) {
            var bullet = this;

            return bullet.owner.formatPointValue(bullet, format);
        }
    });
    deepExtend(Bullet.fn, PointEventsMixin);
    deepExtend(Bullet.fn, NoteMixin);

    var Target = ShapeElement.extend();
    deepExtend(Target.fn, PointEventsMixin);

    var ErrorBarBase = ChartElement.extend({
        init: function(low, high, isVertical, chart, series, options) {
            var errorBar = this;
            errorBar.low = low;
            errorBar.high = high;
            errorBar.isVertical = isVertical;
            errorBar.chart = chart;
            errorBar.series = series;

            ChartElement.fn.init.call(errorBar, options);
        },

        getAxis: function(){},

        reflow: function(targetBox) {
            var linePoints,
                errorBar = this,
                endCaps = errorBar.options.endCaps,
                isVertical = errorBar.isVertical,
                axis = errorBar.getAxis(),
                valueBox = axis.getSlot(errorBar.low, errorBar.high),
                centerBox = targetBox.center(),
                capsWidth = errorBar.getCapsWidth(targetBox, isVertical),
                capValue = isVertical ? centerBox.x: centerBox.y,
                capStart = capValue - capsWidth,
                capEnd = capValue + capsWidth;

            if (isVertical) {
                linePoints = [
                    Point2D(centerBox.x, valueBox.y1),
                    Point2D(centerBox.x, valueBox.y2)
                ];
                if (endCaps) {
                    linePoints.push(Point2D(capStart, valueBox.y1),
                        Point2D(capEnd, valueBox.y1),
                        Point2D(capStart, valueBox.y2),
                        Point2D(capEnd, valueBox.y2));
                }
            } else {
                linePoints = [
                    Point2D(valueBox.x1, centerBox.y),
                    Point2D(valueBox.x2, centerBox.y)
                ];
                if (endCaps) {
                    linePoints.push(Point2D(valueBox.x1, capStart),
                        Point2D(valueBox.x1, capEnd),
                        Point2D(valueBox.x2, capStart),
                        Point2D(valueBox.x2, capEnd));
                }
            }

            errorBar.linePoints = linePoints;
        },

        getCapsWidth: function(box, isVertical) {
            var boxSize = isVertical ? box.width() : box.height(),
                capsWidth = math.min(math.floor(boxSize / 2), DEFAULT_ERROR_BAR_WIDTH) || DEFAULT_ERROR_BAR_WIDTH;

            return capsWidth;
        },

        getViewElements: function(view) {
            var errorBar = this,
                options = errorBar.options,
                parent = errorBar.parent,
                line = options.line,
                lineOptions = {
                    stroke: options.color,
                    strokeWidth: line.width,
                    zIndex: line.zIndex,
                    align: false,
                    dashType: line.dashType
                },
                linePoints = errorBar.linePoints,
                elements = [],
                idx;

            for (idx = 0; idx < linePoints.length; idx+=2) {
                elements.push(view.createLine(linePoints[idx].x, linePoints[idx].y,
                    linePoints[idx + 1].x, linePoints[idx + 1].y, lineOptions));
            }

            return elements;
        },

        options: {
            animation: {
                type: FADEIN,
                delay: INITIAL_ANIMATION_DURATION
            },
            endCaps: true,
            line: {
                width: 1,
                zIndex: 1
            }
        }
    });

    var CategoricalErrorBar = ErrorBarBase.extend({
        getAxis: function() {
            var errorBar = this,
                chart = errorBar.chart,
                series = errorBar.series,
                axis = chart.seriesValueAxis(series);

            return axis;
        }
    });

    var ScatterErrorBar = ErrorBarBase.extend({
        getAxis: function() {
            var errorBar = this,
                chart = errorBar.chart,
                series = errorBar.series,
                axes = chart.seriesAxes(series),
                axis = errorBar.isVertical ? axes.y : axes.x;
            return axis;
        }
    });

    var LinePoint = ChartElement.extend({
        init: function(value, options) {
            var point = this;

            ChartElement.fn.init.call(point);

            point.value = value;
            point.options = options;
            point.color = options.color;
            point.aboveAxis = valueOrDefault(point.options.aboveAxis, true);
            point.id = uniqueId();

            point.enableDiscovery();
        },

        defaults: {
            vertical: true,
            markers: {
                visible: true,
                background: WHITE,
                size: LINE_MARKER_SIZE,
                type: CIRCLE,
                border: {
                    width: 2
                },
                opacity: 1
            },
            labels: {
                visible: false,
                position: ABOVE,
                margin: getSpacing(3),
                padding: getSpacing(4),
                animation: {
                    type: FADEIN,
                    delay: INITIAL_ANIMATION_DURATION
                }
            },
            notes: {
                label: {}
            },
            highlight: {
                markers: {
                    border: {}
                }
            }
        },

        render: function() {
            var point = this,
                options = point.options,
                markers = options.markers,
                labels = options.labels,
                labelText = point.value;

            if (point._rendered) {
                return;
            } else {
                point._rendered = true;
            }

            if (markers.visible && markers.size) {
                point.marker = point.createMarker();
                point.marker.id = point.id;
                point.append(point.marker);
            }

            if (labels.visible) {
                if (labels.template) {
                    var labelTemplate = template(labels.template);
                    labelText = labelTemplate({
                        dataItem: point.dataItem,
                        category: point.category,
                        value: point.value,
                        percentage: point.percentage,
                        series: point.series
                    });
                } else if (labels.format) {
                    labelText = point.formatValue(labels.format);
                }
                point.label = new TextBox(labelText,
                    deepExtend({
                        id: uniqueId(),
                        align: CENTER,
                        vAlign: CENTER,
                        margin: {
                            left: 5,
                            right: 5
                        }
                    }, labels)
                );
                point.append(point.label);
            }

            point.createNote();

            if (point.errorBar) {
                point.append(point.errorBar);
            }
        },

        markerBorder: function() {
            var options = this.options.markers;
            var background = options.background;
            var border = deepExtend({ color: this.color }, options.border);

            if (!defined(border.color)) {
                border.color =
                    new Color(background).brightness(BAR_BORDER_BRIGHTNESS).toHex();
            }

            return border;
        },

        createMarker: function() {
            var options = this.options.markers;
            var marker = new ShapeElement({
                type: options.type,
                width: options.size,
                height: options.size,
                rotation: options.rotation,
                background: options.background,
                border: this.markerBorder(),
                opacity: options.opacity,
                zIndex: options.zIndex,
                animation: options.animation
            });

            return marker;
        },

        markerBox: function() {
            if (!this.marker) {
                this.marker = this.createMarker();
                this.marker.reflow(this._childBox);
            }

            return this.marker.box;
        },

        reflow: function(targetBox) {
            var point = this,
                options = point.options,
                vertical = options.vertical,
                aboveAxis = point.aboveAxis,
                childBox, center;

            point.render();

            point.box = targetBox;
            childBox = targetBox.clone();

            if (vertical) {
                if (aboveAxis) {
                    childBox.y1 -= childBox.height();
                } else {
                    childBox.y2 += childBox.height();
                }
            } else {
                if (aboveAxis) {
                    childBox.x1 += childBox.width();
                } else {
                    childBox.x2 -= childBox.width();
                }
            }

            point._childBox = childBox;
            if (point.marker) {
                point.marker.reflow(childBox);
            }

            point.reflowLabel(childBox);

            if (point.errorBars) {
                for(var i = 0; i < point.errorBars.length; i++){
                     point.errorBars[i].reflow(childBox);
                }
            }

            if (point.note) {
                var noteTargetBox = point.markerBox();

                if (!point.marker) {
                    center = noteTargetBox.center();
                    noteTargetBox = Box2D(center.x, center.y, center.x, center.y);
                }

                point.note.reflow(noteTargetBox);
            }
        },

        reflowLabel: function(box) {
            var point = this,
                options = point.options,
                label = point.label,
                anchor = options.labels.position;

            if (label) {
                anchor = anchor === ABOVE ? TOP : anchor;
                anchor = anchor === BELOW ? BOTTOM : anchor;

                label.reflow(box);
                label.box.alignTo(point.markerBox(), anchor);
                label.reflow(label.box);
            }
        },

        highlightOverlay: function(view, options) {
            var element = this,
                highlight = element.options.highlight,
                markers = highlight.markers,
                defaultColor = element.markerBorder().color;

            options = deepExtend({ data: { modelId: element.modelId } }, options, {
                fill: markers.color || defaultColor,
                stroke: markers.border.color,
                strokeWidth: markers.border.width,
                strokeOpacity: markers.border.opacity || 0,
                fillOpacity: markers.opacity || 1,
                visible: markers.visible
            });

            var marker = this.marker || this.createMarker();
            return marker.getViewElements(view, options)[0];
        },

        tooltipAnchor: function(tooltipWidth, tooltipHeight) {
            var point = this,
                markerBox = point.markerBox(),
                options = point.options,
                aboveAxis = point.aboveAxis,
                x = markerBox.x2 + TOOLTIP_OFFSET,
                y = aboveAxis ? markerBox.y1 - tooltipHeight : markerBox.y2,
                clipBox = point.owner.pane.clipBox(),
                showTooltip = !clipBox || clipBox.overlaps(markerBox);

            if (showTooltip) {
                return Point2D(x, y);
            }
        },

        formatValue: function(format) {
            var point = this;

            return point.owner.formatPointValue(point, format);
        }
    });
    deepExtend(LinePoint.fn, PointEventsMixin);
    deepExtend(LinePoint.fn, NoteMixin);

    var Bubble = LinePoint.extend({
        init: function(value, options) {
            var point = this;

            LinePoint.fn.init.call(point, value,
               deepExtend({}, this.defaults, options)
            );

            point.category = value.category;
        },

        defaults: {
            labels: {
                position: CENTER
            },
            highlight: {
                opacity: 1,
                border: {
                    width: 1,
                    opacity: 1
                }
            }
        },

        highlightOverlay: function(view) {
            var element = this,
                options = element.options,
                highlight = options.highlight,
                borderWidth = highlight.border.width,
                markers = options.markers,
                center = element.box.center(),
                radius = markers.size / 2 - borderWidth / 2,
                borderColor =
                    highlight.border.color ||
                    new Color(markers.background).brightness(BAR_BORDER_BRIGHTNESS).toHex();

            return view.createCircle(center, radius, {
                id: null,
                data: { modelId: element.modelId },
                stroke: borderColor,
                strokeWidth: borderWidth,
                strokeOpacity: highlight.border.opacity
            });
        },

        toggleHighlight: function(view) {
            var element = this,
                opacity = element.options.highlight.opacity;

            element.highlighted = !element.highlighted;

            var marker = element.marker.getViewElements(view, {
                fillOpacity: element.highlighted ? opacity : undefined
            })[0];

            marker.refresh(getElement(this.id));
        }
    });

    var LineSegment = ChartElement.extend({
        init: function(linePoints, series, seriesIx) {
            var segment = this;

            ChartElement.fn.init.call(segment);

            segment.linePoints = linePoints;
            segment.series = series;
            segment.seriesIx = seriesIx;
            segment.id = uniqueId();

            segment.enableDiscovery();
        },

        options: {
            closed: false
        },

        points: function(visualPoints) {
            var segment = this,
                linePoints = segment.linePoints.concat(visualPoints || []),
                points = [],
                i,
                length = linePoints.length,
                pointCenter;

            for (i = 0; i < length; i++) {
                if (linePoints[i].visible !== false) {
                    pointCenter = linePoints[i].markerBox().center();

                    points.push(Point2D(pointCenter.x, pointCenter.y));
                }
            }

            return points;
        },

        getViewElements: function(view) {
            var segment = this,
                options = segment.options,
                series = segment.series,
                defaults = series._defaults,
                color = series.color;

            ChartElement.fn.getViewElements.call(segment, view);

            if (isFn(color) && defaults) {
                color = defaults.color;
            }

            return [
                view.createPolyline(segment.points(), options.closed, {
                    id: segment.id,
                    stroke: color,
                    strokeWidth: series.width,
                    strokeOpacity: series.opacity,
                    fill: "",
                    dashType: series.dashType,
                    data: { modelId: segment.modelId },
                    zIndex: -1
                })
            ];
        },

        aliasFor: function(e, coords) {
            var segment = this,
                seriesIx = segment.seriesIx;

            return segment.parent.getNearestPoint(coords.x, coords.y, seriesIx);
        }
    });

    var LineChartMixin = {
        renderSegments: function() {
            var chart = this,
                options = chart.options,
                series = options.series,
                seriesPoints = chart.seriesPoints,
                currentSeries, seriesIx,
                seriesCount = seriesPoints.length,
                sortedPoints, linePoints,
                point, pointIx, pointCount,
                segments = [];

            for (seriesIx = 0; seriesIx < seriesCount; seriesIx++) {
                currentSeries = series[seriesIx];
                sortedPoints = chart.sortPoints(seriesPoints[seriesIx]);
                pointCount = sortedPoints.length;
                linePoints = [];

                for (pointIx = 0; pointIx < pointCount; pointIx++) {
                    point = sortedPoints[pointIx];
                    if (point) {
                        linePoints.push(point);
                    } else if (chart.seriesMissingValues(currentSeries) !== INTERPOLATE) {
                        if (linePoints.length > 1) {
                            segments.push(
                                chart.createSegment(
                                    linePoints, currentSeries, seriesIx, last(segments)
                                )
                            );
                        }
                        linePoints = [];
                    }
                }

                if (linePoints.length > 1) {
                    segments.push(
                        chart.createSegment(
                            linePoints, currentSeries, seriesIx, last(segments)
                        )
                    );
                }
            }

            chart._segments = segments;
            chart.append.apply(chart, segments);
        },

        sortPoints: function(points) {
            return points;
        },

        seriesMissingValues: function(series) {
            var missingValues = series.missingValues,
                assumeZero = !missingValues && this.options.isStacked;

            return assumeZero ? ZERO : missingValues || INTERPOLATE;
        },

        getNearestPoint: function(x, y, seriesIx) {
            var chart = this,
                invertAxes = chart.options.invertAxes,
                axis = invertAxes ? Y : X,
                pos = invertAxes ? y : x,
                points = chart.seriesPoints[seriesIx],
                nearestPointDistance = MAX_VALUE,
                pointsLength = points.length,
                currentPoint,
                pointBox,
                pointDistance,
                nearestPoint,
                i;

            for (i = 0; i < pointsLength; i++) {
                currentPoint = points[i];

                if (currentPoint && defined(currentPoint.value) && currentPoint.value !== null && currentPoint.visible !== false) {
                    pointBox = currentPoint.box;
                    pointDistance = math.abs(pointBox.center()[axis] - pos);

                    if (pointDistance < nearestPointDistance) {
                        nearestPoint = currentPoint;
                        nearestPointDistance = pointDistance;
                    }
                }
            }

            return nearestPoint;
        }
    };

    var LineChart = CategoricalChart.extend({
        init: function(plotArea, options) {
            var chart = this;

            chart.enableDiscovery();

            CategoricalChart.fn.init.call(chart, plotArea, options);
        },

        render: function() {
            var chart = this;

            CategoricalChart.fn.render.apply(chart);

            chart.computeAxisRanges();
            chart.renderSegments();
        },

        pointType: function() {
            return LinePoint;
        },

        createPoint: function(data, category, categoryIx, series, seriesIx) {
            var chart = this,
                value = data.valueFields.value,
                options = chart.options,
                isStacked = options.isStacked,
                categoryPoints = chart.categoryPoints[categoryIx],
                missingValues = chart.seriesMissingValues(series),
                stackPoint,
                plotValue = 0,
                fields = data.fields,
                point,
                pointOptions;

            if (!defined(value) || value === null) {
                if (missingValues === ZERO) {
                    value = 0;
                } else {
                    return null;
                }
            }

            pointOptions = this.pointOptions(series, seriesIx);
            pointOptions = chart.evalPointOptions(
                pointOptions, value, category, categoryIx, series, seriesIx
            );

            var color = data.fields.color || series.color;
            if (kendo.isFunction(series.color)) {
                color = pointOptions.color;
            }

            point = new LinePoint(value, pointOptions);
            point.color = color;

            chart.append(point);

            return point;
        },

        plotRange: function(point) {
            var categoryIx = point.categoryIx;
            var categoryPts = this.categoryPoints[categoryIx];

            if (this.options.isStacked) {
                var plotValue = this.plotValue(point);

                for (var i = 0; i < categoryPts.length; i++) {
                    var other = categoryPts[i];

                    if (point === other) {
                        break;
                    }

                    plotValue += this.plotValue(other);
                }

                return [plotValue, plotValue];
            } else {
                var plotRange = CategoricalChart.fn.plotRange.call(this, point);
                return [plotRange[1], plotRange[1]];
            }
        },

        createSegment: function(linePoints, currentSeries, seriesIx) {
            var pointType,
                style = currentSeries.style;

            if (style === STEP) {
                pointType = StepLineSegment;
            } else if (style === SMOOTH) {
                pointType = SplineSegment;
            } else {
                pointType = LineSegment;
            }

            return new pointType(linePoints, currentSeries, seriesIx);
        },

        getViewElements: function(view) {
            var chart = this,
                elements = CategoricalChart.fn.getViewElements.call(chart, view),
                group = view.createGroup({
                    animation: {
                        type: CLIP
                    }
                });

            group.children = elements;

            return [group];
        }
    });
    deepExtend(LineChart.fn, LineChartMixin);

    var StepLineSegment = LineSegment.extend({
        points: function(visualPoints) {
            var segment = this,
                points;

            points = segment.calculateStepPoints(segment.linePoints);

            if (visualPoints && visualPoints.length) {
                points = points.concat(segment.calculateStepPoints(visualPoints).reverse());
            }

            return points;
        },

        calculateStepPoints: function(points) {
            var segment = this,
                chart = segment.parent,
                plotArea = chart.plotArea,
                categoryAxis = plotArea.seriesCategoryAxis(segment.series),
                isInterpolate = chart.seriesMissingValues(segment.series) === INTERPOLATE,
                length = points.length,
                reverse = categoryAxis.options.reverse,
                vertical = categoryAxis.options.vertical,
                dir = reverse ? 2 : 1,
                revDir = reverse ? 1 : 2,
                prevPoint, point, i,
                prevMarkerBoxCenter, markerBoxCenter,
                result = [];

            for (i = 1; i < length; i++) {
                prevPoint = points[i - 1];
                point = points[i];
                prevMarkerBoxCenter = prevPoint.markerBox().center();
                markerBoxCenter = point.markerBox().center();
                if (categoryAxis.options.justified) {
                    result.push(Point2D(prevMarkerBoxCenter.x, prevMarkerBoxCenter.y));
                    if (vertical) {
                        result.push(Point2D(prevMarkerBoxCenter.x, markerBoxCenter.y));
                    } else {
                        result.push(Point2D(markerBoxCenter.x, prevMarkerBoxCenter.y));
                    }
                    result.push(Point2D(markerBoxCenter.x, markerBoxCenter.y));
                } else {
                    if (vertical) {
                        result.push(Point2D(prevMarkerBoxCenter.x, prevPoint.box[Y + dir]));
                        result.push(Point2D(prevMarkerBoxCenter.x, prevPoint.box[Y + revDir]));
                        if (isInterpolate) {
                            result.push(Point2D(prevMarkerBoxCenter.x, point.box[Y + dir]));
                        }
                        result.push(Point2D(markerBoxCenter.x, point.box[Y + dir]));
                        result.push(Point2D(markerBoxCenter.x, point.box[Y + revDir]));
                    } else {
                        result.push(Point2D(prevPoint.box[X + dir], prevMarkerBoxCenter.y));
                        result.push(Point2D(prevPoint.box[X + revDir], prevMarkerBoxCenter.y));
                        if (isInterpolate) {
                            result.push(Point2D(point.box[X + dir], prevMarkerBoxCenter.y));
                        }
                        result.push(Point2D(point.box[X + dir], markerBoxCenter.y));
                        result.push(Point2D(point.box[X + revDir], markerBoxCenter.y));
                    }
                }
            }

            return result || [];
        }
    });

    var SplineSegment = LineSegment.extend({
        points: function(){
            var segment = this,
                curveProcessor = new CurveProcessor(segment.options.closed),
                points = LineSegment.fn.points.call(this);

            return curveProcessor.process(points);
        },
        getViewElements: function(view) {
            var segment = this,
                series = segment.series,
                defaults = series._defaults,
                color = series.color;

            ChartElement.fn.getViewElements.call(segment, view);

            if (isFn(color) && defaults) {
                color = defaults.color;
            }

            return [
                view.createCubicCurve(segment.points(), {
                    id: segment.id,
                    stroke: color,
                    strokeWidth: series.width,
                    strokeOpacity: series.opacity,
                    fill: "",
                    dashType: series.dashType,
                    data: { modelId: segment.modelId },
                    zIndex: -1
                })
            ];
        }
    });

    var AreaSegmentMixin = {
        points: function() {
            var segment = this,
                chart = segment.parent,
                plotArea = chart.plotArea,
                invertAxes = chart.options.invertAxes,
                valueAxis = chart.seriesValueAxis(segment.series),
                valueAxisLineBox = valueAxis.lineBox(),
                categoryAxis = plotArea.seriesCategoryAxis(segment.series),
                categoryAxisLineBox = categoryAxis.lineBox(),
                end = invertAxes ? categoryAxisLineBox.x1 : categoryAxisLineBox.y1,
                stackPoints = segment.stackPoints,
                points = segment._linePoints(stackPoints),
                pos = invertAxes ? X : Y,
                firstPoint, lastPoint;

            end = limitValue(end, valueAxisLineBox[pos + 1], valueAxisLineBox[pos + 2]);
            if (!segment.stackPoints && points.length > 1) {
                firstPoint = points[0];
                lastPoint = last(points);

                if (invertAxes) {
                    points.unshift(Point2D(end, firstPoint.y));
                    points.push(Point2D(end, lastPoint.y));
                } else {
                    points.unshift(Point2D(firstPoint.x, end));
                    points.push(Point2D(lastPoint.x, end));
                }
            }

            return points;
        },

        getViewElements: function(view) {
            var segment = this,
                series = segment.series,
                defaults = series._defaults,
                color = series.color,
                elements = [],
                line;

            ChartElement.fn.getViewElements.call(segment, view);

            if (isFn(color) && defaults) {
                color = defaults.color;
            }

            elements.push(this.createArea(view, color));
            line = this.createLine(view, color);
            if (line) {
                elements.push(line);
            }

            return elements;
        },

        createLine: function(view, color) {
            var segment = this,
                series = segment.series,
                lineOptions = deepExtend({
                        color: color,
                        opacity: series.opacity
                    }, series.line
                ),
                element;

            if (lineOptions.visible !== false && lineOptions.width > 0) {
                element = view.createPolyline(segment._linePoints(), false, {
                    stroke: lineOptions.color,
                    strokeWidth: lineOptions.width,
                    strokeOpacity: lineOptions.opacity,
                    dashType: lineOptions.dashType,
                    data: { modelId: segment.modelId },
                    strokeLineCap: "butt",
                    zIndex: -1,
                    align: false
                });
            }

            return element;
        },

        createArea: function(view, color) {
            var segment = this,
                series = segment.series;

            return view.createPolyline(segment.points(), false, {
                id: segment.id,
                fillOpacity: series.opacity,
                fill: color,
                stack: series.stack,
                data: { modelId: segment.modelId },
                zIndex: -1
            });
        }
    };

    var AreaSegment = LineSegment.extend({
        init: function(linePoints, stackPoints, currentSeries, seriesIx) {
            var segment = this;

            segment.stackPoints = stackPoints;

            LineSegment.fn.init.call(segment, linePoints, currentSeries, seriesIx);
        },

        _linePoints: LineSegment.fn.points
    });
    deepExtend(AreaSegment.fn, AreaSegmentMixin);

    var AreaChart = LineChart.extend({
        createSegment: function(linePoints, currentSeries, seriesIx, prevSegment) {
            var chart = this,
                options = chart.options,
                isStacked = options.isStacked,
                stackPoints, pointType,
                style = (currentSeries.line || {}).style;

            if (isStacked && seriesIx > 0 && prevSegment) {
                stackPoints = prevSegment.linePoints;
                if (style !== STEP) {
                    stackPoints = stackPoints.slice(0).reverse();
                }
            }

            if (style === SMOOTH) {
                return new SplineAreaSegment(linePoints, prevSegment, isStacked, currentSeries, seriesIx);
            }

            if (style === STEP) {
                pointType = StepAreaSegment;
            } else {
                pointType = AreaSegment;
            }

            return new pointType(linePoints, stackPoints, currentSeries, seriesIx);
        },

        seriesMissingValues: function(series) {
            return series.missingValues || ZERO;
        }
    });

    var SplineAreaSegment = AreaSegment.extend({
        init: function(linePoints, prevSegment, isStacked, currentSeries, seriesIx) {
            var segment = this;

            segment.prevSegment = prevSegment;
            segment.isStacked = isStacked;
            LineSegment.fn.init.call(segment, linePoints, currentSeries, seriesIx);
        },

        points: function() {
            var segment = this,
                prevSegment = segment.prevSegment,
                curveProcessor = new CurveProcessor(segment.options.closed),
                linePoints = LineSegment.fn.points.call(this),
                curvePoints = curveProcessor.process(linePoints),
                previousPoints,
                points;

            segment.curvePoints = curvePoints;

            if (segment.isStacked && prevSegment) {
                points = curvePoints.slice(0);
                points.push(last(curvePoints));
                previousPoints = prevSegment.curvePoints.slice(0).reverse();
                previousPoints.unshift(previousPoints[0]);
                points = points.concat(previousPoints);
                points.push(last(previousPoints), points[0], points[0]);
            } else {
                points = segment.curvePoints;
            }

            return points;
        },

        areaPoints: function(points) {
            var segment = this,
                chart = segment.parent,
                prevSegment = segment.prevSegment,
                plotArea = chart.plotArea,
                invertAxes = chart.options.invertAxes,
                valueAxis = chart.seriesValueAxis(segment.series),
                valueAxisLineBox = valueAxis.lineBox(),
                categoryAxis = plotArea.seriesCategoryAxis(segment.series),
                categoryAxisLineBox = categoryAxis.lineBox(),
                end = invertAxes ? categoryAxisLineBox.x1 : categoryAxisLineBox.y1,
                pos = invertAxes ? X : Y,
                firstPoint = points[0],
                lastPoint = last(points),
                areaPoints = [];

            end = limitValue(end, valueAxisLineBox[pos + 1], valueAxisLineBox[pos + 2]);
            if (!(chart.options.isStacked && prevSegment) && points.length > 1) {

                if (invertAxes) {
                    areaPoints.push(Point2D(end, firstPoint.y));
                    areaPoints.unshift(Point2D(end, lastPoint.y));
                } else {
                    areaPoints.push(Point2D(firstPoint.x, end));
                    areaPoints.unshift(Point2D(lastPoint.x, end));
                }
            }

            return areaPoints;
        },

        getViewElements: function(view) {
            var segment = this,
                series = segment.series,
                defaults = series._defaults,
                color = series.color,
                lineOptions,
                curvePoints = segment.points(),
                areaPoints = segment.areaPoints(curvePoints),
                viewElements = [];

            ChartElement.fn.getViewElements.call(segment, view);

            if (isFn(color) && defaults) {
                color = defaults.color;
            }

            lineOptions = deepExtend({
                    color: color,
                    opacity: series.opacity
                }, series.line
            );

           viewElements.push(view.createCubicCurve(curvePoints,{
                    id: segment.id,
                    fillOpacity: series.opacity,
                    fill: color,
                    stack: series.stack,
                    data: { modelId: segment.modelId },
                    zIndex: -1
                }, areaPoints));

            if (lineOptions.width > 0) {
                viewElements.push(view.createCubicCurve(segment.curvePoints, {
                    stroke: lineOptions.color,
                    strokeWidth: lineOptions.width,
                    strokeOpacity: lineOptions.opacity,
                    dashType: lineOptions.dashType,
                    data: { modelId: segment.modelId },
                    strokeLineCap: "butt",
                    zIndex: -1
                }));
            }

            return viewElements;
        }
    });

    var StepAreaSegment = StepLineSegment.extend({
        init: function(linePoints, stackPoints, currentSeries, seriesIx) {
            var segment = this;

            segment.stackPoints = stackPoints;

            StepLineSegment.fn.init.call(segment, linePoints, currentSeries, seriesIx);
        },

        _linePoints: StepLineSegment.fn.points
    });
    deepExtend(StepAreaSegment.fn, AreaSegmentMixin);

    var ScatterChart = ChartElement.extend({
        init: function(plotArea, options) {
            var chart = this;

            ChartElement.fn.init.call(chart, options);

            chart.plotArea = plotArea;

            // X and Y axis ranges grouped by name, e.g.:
            // primary: { min: 0, max: 1 }
            chart.xAxisRanges = {};
            chart.yAxisRanges = {};

            chart.points = [];
            chart.seriesPoints = [];

            chart.render();
        },

        options: {
            series: [],
            tooltip: {
                format: "{0}, {1}"
            },
            labels: {
                format: "{0}, {1}"
            },
            clip: true
        },

        render: function() {
            var chart = this;

            chart.traverseDataPoints(proxy(chart.addValue, chart));
        },

        addErrorBar: function(point, field, fields){
            var errorRange,
                chart = this,
                value = point.value[field],
                valueErrorField = field + "Value",
                lowField = field + "ErrorLow",
                highField = field + "ErrorHigh",
                seriesIx = fields.seriesIx,
                series = fields.series,
                errorBars = point.options.errorBars,
                lowValue = fields[lowField],
                highValue = fields[highField];

            if (isNumber(value)) {
                if (isNumber(lowValue) && isNumber(highValue)) {
                    errorRange = {low: lowValue, high: highValue};
                }

                if (errorBars && defined(errorBars[valueErrorField])) {
                    chart.seriesErrorRanges = chart.seriesErrorRanges || {x: [], y: []};
                    chart.seriesErrorRanges[field][seriesIx] = chart.seriesErrorRanges[field][seriesIx] ||
                        new ErrorRangeCalculator(errorBars[valueErrorField], series, field);

                    errorRange = chart.seriesErrorRanges[field][seriesIx].getErrorRange(value);
                }

                if (errorRange) {
                    chart.addPointErrorBar(errorRange, point, field);
                }
            }
        },

        addPointErrorBar: function(errorRange, point, field){
            var chart = this,
                low = errorRange.low,
                high = errorRange.high,
                series = point.series,
                isVertical = field === Y,
                options = point.options.errorBars,
                item = {},
                errorBar;

            point[field + "Low"] = low;
            point[field + "High"] = high;

            point.errorBars = point.errorBars || [];
            errorBar = new ScatterErrorBar(low, high, isVertical, chart, series, options);
            point.errorBars.push(errorBar);
            point.append(errorBar);

            item[field] = low;
            chart.updateRange(item, series);
            item[field] = high;
            chart.updateRange(item, series);
        },

        addValue: function(value, fields) {
            var chart = this,
                point,
                x = value.x,
                y = value.y,
                seriesIx = fields.seriesIx,
                seriesPoints = chart.seriesPoints[seriesIx];

            chart.updateRange(value, fields.series);

            if (defined(x) && x !== null && defined(y) && y !== null) {
                point = chart.createPoint(value, fields);
                if (point) {
                    extend(point, fields);
                    chart.addErrorBar(point, X, fields);
                    chart.addErrorBar(point, Y, fields);
                }
            }

            chart.points.push(point);
            seriesPoints.push(point);
        },

        updateRange: function(value, series) {
            var chart = this,
                x = value.x,
                y = value.y,
                xAxisName = series.xAxis,
                yAxisName = series.yAxis,
                xAxisRange = chart.xAxisRanges[xAxisName],
                yAxisRange = chart.yAxisRanges[yAxisName];

            if (defined(x) && x !== null) {
                xAxisRange = chart.xAxisRanges[xAxisName] =
                    xAxisRange || { min: MAX_VALUE, max: MIN_VALUE };

                if (typeof(x) === STRING) {
                    x = toDate(x);
                }

                xAxisRange.min = math.min(xAxisRange.min, x);
                xAxisRange.max = math.max(xAxisRange.max, x);
            }

            if (defined(y) && y !== null) {
                yAxisRange = chart.yAxisRanges[yAxisName] =
                    yAxisRange || { min: MAX_VALUE, max: MIN_VALUE };

                if (typeof(y) === STRING) {
                    y = toDate(y);
                }

                yAxisRange.min = math.min(yAxisRange.min, y);
                yAxisRange.max = math.max(yAxisRange.max, y);
            }
        },

        evalPointOptions: function(options, value, fields) {
            var series = fields.series;

            evalOptions(options, {
                value: value,
                series: series,
                dataItem: fields.dataItem
            }, { defaults: series._defaults, excluded: ["data", "tooltip"] });
        },

        createPoint: function(value, fields) {
            var chart = this,
                series = fields.series,
                point,
                pointOptions;

            pointOptions = deepExtend({}, LinePoint.fn.defaults, {
                markers: {
                    opacity: series.opacity
                },
                tooltip: {
                    format: chart.options.tooltip.format
                },
                labels: {
                    format: chart.options.labels.format
                }
            }, series, {
                color: fields.color
            });

            chart.evalPointOptions(pointOptions, value, fields);

            point = new LinePoint(value, pointOptions);

            chart.append(point);

            return point;
        },

        seriesAxes: function(series) {
            var plotArea = this.plotArea,
                xAxisName = series.xAxis,
                xAxis = xAxisName ?
                        plotArea.namedXAxes[xAxisName] :
                        plotArea.axisX,
                yAxisName = series.yAxis,
                yAxis = yAxisName ?
                        plotArea.namedYAxes[yAxisName] :
                        plotArea.axisY;

            if (!xAxis) {
                throw new Error("Unable to locate X axis with name " + xAxisName);
            }

            if (!yAxis) {
                throw new Error("Unable to locate Y axis with name " + yAxisName);
            }

            return {
                x: xAxis,
                y: yAxis
            };
        },

        reflow: function(targetBox) {
            var chart = this,
                chartPoints = chart.points,
                pointIx = 0,
                point,
                seriesAxes,
                clip = chart.options.clip,
                limit = !chart.options.clip;

            chart.traverseDataPoints(function(value, fields) {
                point = chartPoints[pointIx++];
                seriesAxes = chart.seriesAxes(fields.series);

                var slotX = seriesAxes.x.getSlot(value.x, value.x, limit),
                    slotY = seriesAxes.y.getSlot(value.y, value.y, limit),
                    pointSlot;

                if (point) {
                    if (slotX && slotY) {
                        pointSlot = chart.pointSlot(slotX, slotY);
                        point.reflow(pointSlot);
                    } else {
                        point.visible = false;
                    }
                }
            });

            chart.box = targetBox;
        },

        pointSlot: function(slotX, slotY) {
            return new Box2D(slotX.x1, slotY.y1, slotX.x2, slotY.y2);
        },

        getViewElements: function(view) {
            var chart = this,
                elements = ChartElement.fn.getViewElements.call(chart, view),
                group = view.createGroup({
                    animation: {
                        type: CLIP
                    }
                });

            group.children = elements;
            return [group];
        },

        traverseDataPoints: function(callback) {
            var chart = this,
                options = chart.options,
                series = options.series,
                seriesPoints = chart.seriesPoints,
                pointIx,
                seriesIx,
                currentSeries,
                currentSeriesPoints,
                pointData,
                value,
                fields;

            for (seriesIx = 0; seriesIx < series.length; seriesIx++) {
                currentSeries = series[seriesIx];
                currentSeriesPoints = seriesPoints[seriesIx];
                if (!currentSeriesPoints) {
                    seriesPoints[seriesIx] = [];
                }

                for (pointIx = 0; pointIx < currentSeries.data.length; pointIx++) {
                    pointData = SeriesBinder.current.bindPoint(currentSeries, pointIx);
                    value = pointData.valueFields;
                    fields = pointData.fields;

                   callback(value, deepExtend({
                       pointIx: pointIx,
                       series: currentSeries,
                       seriesIx: seriesIx,
                       dataItem: currentSeries.data[pointIx],
                       owner: chart
                   }, fields));
                }
            }
        },

        formatPointValue: function(point, format) {
            var value = point.value;
            return autoFormat(format, value.x, value.y);
        }
    });

    var ScatterLineChart = ScatterChart.extend({
        render: function() {
            var chart = this;

            ScatterChart.fn.render.call(chart);

            chart.renderSegments();
        },

        createSegment: function(linePoints, currentSeries, seriesIx) {
            var pointType,
                style = currentSeries.style;

            if (style === SMOOTH) {
                pointType = SplineSegment;
            } else {
                pointType = LineSegment;
            }

            return new pointType(linePoints, currentSeries, seriesIx);
        }
    });
    deepExtend(ScatterLineChart.fn, LineChartMixin);

    var BubbleChart = ScatterChart.extend({
        options: {
            tooltip: {
                format: "{3}"
            },
            labels: {
                format: "{3}"
            }
        },

        addValue: function(value, fields) {
            var chart = this,
                color,
                series = fields.series,
                negativeValues = series.negativeValues,
                seriesColors = chart.plotArea.options.seriesColors || [],
                visible = true;

            color = fields.color || series.color ||
                seriesColors[fields.pointIx % seriesColors.length];

            if (value.size < 0) {
                color = negativeValues.color || color;
                visible = negativeValues.visible;
            }

            fields.color = color;

            if (visible) {
                ScatterChart.fn.addValue.call(this, value, fields);
            }
        },

        reflow: function(box) {
            var chart = this;

            chart.updateBubblesSize(box);
            ScatterChart.fn.reflow.call(chart, box);
        },

        createPoint: function(value, fields) {
            var chart = this,
                point,
                pointOptions,
                series = fields.series,
                pointsCount = series.data.length,
                delay = fields.pointIx * (INITIAL_ANIMATION_DURATION / pointsCount),
                animationOptions = {
                    delay: delay,
                    duration: INITIAL_ANIMATION_DURATION - delay,
                    type: BUBBLE
                };

            pointOptions = deepExtend({
                tooltip: {
                    format: chart.options.tooltip.format
                },
                labels: {
                    format: chart.options.labels.format,
                    animation: animationOptions
                }
            },
            series, {
                color: fields.color,
                markers: {
                    type: CIRCLE,
                    background: fields.color,
                    border: series.border,
                    opacity: series.opacity,
                    animation: animationOptions
                }
            });

            chart.evalPointOptions(pointOptions, value, fields);

            point = new Bubble(value, pointOptions);

            chart.append(point);

            return point;
        },

        updateBubblesSize: function(box) {
            var chart = this,
                options = chart.options,
                series = options.series,
                boxSize = math.min(box.width(), box.height()),
                seriesIx,
                pointIx;

            for (seriesIx = 0; seriesIx < series.length; seriesIx++) {
                var currentSeries = series[seriesIx],
                    seriesPoints = chart.seriesPoints[seriesIx],
                    seriesMaxSize = chart.maxSize(seriesPoints),
                    minSize = currentSeries.minSize || math.max(boxSize * 0.02, 10),
                    maxSize = currentSeries.maxSize || boxSize * 0.2,
                    minR = minSize / 2,
                    maxR = maxSize / 2,
                    minArea = math.PI * minR * minR,
                    maxArea = math.PI * maxR * maxR,
                    areaRange = maxArea - minArea,
                    areaRatio = areaRange / seriesMaxSize;

                for (pointIx = 0; pointIx < seriesPoints.length; pointIx++) {
                    var point = seriesPoints[pointIx],
                        area = math.abs(point.value.size) * areaRatio,
                        r = math.sqrt((minArea + area) / math.PI);

                    deepExtend(point.options, {
                        markers: {
                            size: r * 2,
                            zIndex: maxR - r
                        },
                        labels: {
                            zIndex: maxR - r + 1
                        }
                    });
                }
            }
        },

        maxSize: function(seriesPoints) {
            var length = seriesPoints.length,
                max = 0,
                i,
                size;

            for (i = 0; i < length; i++) {
                size = seriesPoints[i].value.size;
                max = math.max(max, math.abs(size));
            }

            return max;
        },

        getViewElements: function(view) {
            var chart = this,
                elements = ChartElement.fn.getViewElements.call(chart, view),
                group = view.createGroup();

            group.children = elements;
            return [group];
        },

        formatPointValue: function(point, format) {
            var value = point.value;
            return autoFormat(format, value.x, value.y, value.size, point.category);
        }
    });

    var Candlestick = ChartElement.extend({
        init: function(value, options) {
            var point = this;

            ChartElement.fn.init.call(point, options);
            point.value = value;
            point.id = uniqueId();
            point.enableDiscovery();
        },

        options: {
            border: {
                _brightness: 0.8
            },
            line: {
                width: 2
            },
            overlay: {
                gradient: GLASS
            },
            tooltip: {
                format: "<table style='text-align: left;'>" +
                        "<th colspan='2'>{4:d}</th>" +
                        "<tr><td>Open:</td><td>{0:C}</td></tr>" +
                        "<tr><td>High:</td><td>{1:C}</td></tr>" +
                        "<tr><td>Low:</td><td>{2:C}</td></tr>" +
                        "<tr><td>Close:</td><td>{3:C}</td></tr>" +
                        "</table>"
            },
            highlight: {
                opacity: 1,
                border: {
                    width: 1,
                    opacity: 1
                },
                line: {
                    width: 1,
                    opacity: 1
                }
            },
            notes: {
                visible: true,
                label: {}
            }
        },

        reflow: function(box) {
            var point = this,
                options = point.options,
                chart = point.owner,
                value = point.value,
                valueAxis = chart.seriesValueAxis(options),
                points = [], mid, ocSlot, lhSlot;

            ocSlot = valueAxis.getSlot(value.open, value.close);
            lhSlot = valueAxis.getSlot(value.low, value.high);

            ocSlot.x1 = lhSlot.x1 = box.x1;
            ocSlot.x2 = lhSlot.x2 = box.x2;

            point.realBody = ocSlot;

            mid = lhSlot.center().x;
            points.push([ Point2D(mid, lhSlot.y1), Point2D(mid, ocSlot.y1) ]);
            points.push([ Point2D(mid, ocSlot.y2), Point2D(mid, lhSlot.y2) ]);

            point.lowHighLinePoints = points;

            point.box = lhSlot.clone().wrap(ocSlot);

            if (!point._rendered) {
                point._rendered = true;
                point.createNote();
            }

            point.reflowNote();
        },

        reflowNote: function() {
            var point = this;

            if (point.note) {
                point.note.reflow(point.box);
            }
        },

        getViewElements: function(view) {
            var point = this,
                options = point.options,
                elements = [],
                border = options.border.width > 0 ? {
                    stroke: point.getBorderColor(),
                    strokeWidth: options.border.width,
                    dashType: options.border.dashType,
                    strokeOpacity: valueOrDefault(options.border.opacity, options.opacity)
                } : {},
                rectStyle = deepExtend({
                    fill: options.color,
                    fillOpacity: options.opacity
                }, border),
                lineStyle = {
                    strokeOpacity: valueOrDefault(options.line.opacity, options.opacity),
                    strokeWidth: options.line.width,
                    stroke: options.line.color || options.color,
                    dashType: options.line.dashType,
                    strokeLineCap: "butt"
                };

            if (options.overlay) {
                rectStyle.overlay = deepExtend({
                    rotation: 0
                }, options.overlay);
            }

            elements.push(view.createRect(point.realBody, rectStyle));
            elements.push(view.createPolyline(point.lowHighLinePoints[0], false, lineStyle));
            elements.push(view.createPolyline(point.lowHighLinePoints[1], false, lineStyle));
            elements.push(point.createOverlayRect(view, options));

            append(elements,
                ChartElement.fn.getViewElements.call(point, view)
            );

            return elements;
        },

        getBorderColor: function() {
            var point = this,
                options = point.options,
                border = options.border,
                borderColor = border.color;

            if (!defined(borderColor)) {
                borderColor =
                    new Color(options.color).brightness(border._brightness).toHex();
            }

            return borderColor;
        },

        createOverlayRect: function(view) {
            var point = this;
            return view.createRect(point.box, {
                data: { modelId: point.modelId },
                fill: "#fff",
                id: point.id,
                fillOpacity: 0
            });
        },

        highlightOverlay: function(view, options) {
            var point = this,
                pointOptions = point.options,
                highlight = pointOptions.highlight,
                border = highlight.border,
                borderColor = point.getBorderColor(),
                line = highlight.line,
                data = { data: { modelId: pointOptions.modelId } },
                rectStyle = deepExtend({}, data, options, {
                    stroke: borderColor,
                    strokeOpacity: border.opacity,
                    strokeWidth: border.width
                }),
                lineStyle = deepExtend({}, data, {
                    stroke: line.color || borderColor,
                    strokeWidth: line.width,
                    strokeOpacity: line.opacity,
                    strokeLineCap: "butt"
                }),
                group = view.createGroup();

            group.children.push(view.createRect(point.realBody, rectStyle));
            group.children.push(view.createPolyline(point.lowHighLinePoints[0], false, lineStyle));
            group.children.push(view.createPolyline(point.lowHighLinePoints[1], false, lineStyle));

            return group;
        },

        tooltipAnchor: function() {
            var point = this,
                box = point.box,
                clipBox = point.owner.pane.clipBox() || box;

            return new Point2D(box.x2 + TOOLTIP_OFFSET, math.max(box.y1, clipBox.y1) + TOOLTIP_OFFSET);
        },

        formatValue: function(format) {
            var point = this;
            return point.owner.formatPointValue(point, format);
        }
    });
    deepExtend(Candlestick.fn, PointEventsMixin);
    deepExtend(Candlestick.fn, NoteMixin);

    var CandlestickChart = CategoricalChart.extend({
        options: {},

        reflowCategories: function(categorySlots) {
            var chart = this,
                children = chart.children,
                childrenLength = children.length,
                i;

            for (i = 0; i < childrenLength; i++) {
                children[i].reflow(categorySlots[i]);
            }
        },

        addValue: function(data, category, categoryIx, series, seriesIx) {
            var chart = this,
                options = chart.options,
                value = data.valueFields,
                children = chart.children,
                pointColor = data.fields.color || series.color,
                valueParts = this.splitValue(value),
                hasValue = areNumbers(valueParts),
                categoryPoints = chart.categoryPoints[categoryIx],
                dataItem = series.data[categoryIx],
                point, cluster;

            if (!categoryPoints) {
                chart.categoryPoints[categoryIx] = categoryPoints = [];
            }

            if (hasValue) {
                if (series.type == CANDLESTICK) {
                    if (value.open > value.close) {
                        pointColor = data.fields.downColor || series.downColor || series.color;
                    }
                }

                point = chart.createPoint(
                    data, category, categoryIx,
                    deepExtend({}, series, { color: pointColor })
                );
            }

            cluster = children[categoryIx];
            if (!cluster) {
                cluster = new ClusterLayout({
                    vertical: options.invertAxes,
                    gap: options.gap,
                    spacing: options.spacing
                });
                chart.append(cluster);
            }

            if (point) {
                chart.updateRange(value, categoryIx, series);

                cluster.append(point);

                point.categoryIx = categoryIx;
                point.category = category;
                point.series = series;
                point.seriesIx = seriesIx;
                point.owner = chart;
                point.dataItem = dataItem;
                point.noteText = data.fields.noteText;
            }

            chart.points.push(point);
            categoryPoints.push(point);
        },

        pointType: function() {
            return Candlestick;
        },

        createPoint: function(data, category, categoryIx, series, seriesIx) {
            var chart = this,
                value = data.valueFields,
                pointOptions = deepExtend({}, series),
                pointType = chart.pointType();

            pointOptions = chart.evalPointOptions(
                pointOptions, value, category, categoryIx, series, seriesIx
            );

            return new pointType(value, pointOptions);
        },

        splitValue: function(value) {
            return [value.low, value.open, value.close, value.high];
        },

        updateRange: function(value, categoryIx, series) {
            var chart = this,
                axisName = series.axis,
                axisRange = chart.valueAxisRanges[axisName],
                parts = chart.splitValue(value);

            axisRange = chart.valueAxisRanges[axisName] =
                axisRange || { min: MAX_VALUE, max: MIN_VALUE };

            axisRange = chart.valueAxisRanges[axisName] = {
                min: math.min.apply(math, parts.concat([axisRange.min])),
                max: math.max.apply(math, parts.concat([axisRange.max]))
            };
        },

        formatPointValue: function(point, format) {
            var value = point.value;

            return autoFormat(format,
                value.open, value.high,
                value.low, value.close, point.category
            );
        },

        getViewElements: function(view) {
            var chart = this,
                elements = ChartElement.fn.getViewElements.call(chart, view),
                group = view.createGroup({
                    animation: {
                        type: CLIP
                    }
                });

            group.children = elements;
            return [group];
        }
    });

    var OHLCPoint = Candlestick.extend({
        reflow: function(box) {
            var point = this,
                options = point.options,
                chart = point.owner,
                value = point.value,
                valueAxis = chart.seriesValueAxis(options),
                oPoints = [], cPoints = [], lhPoints = [],
                mid, oSlot, cSlot, lhSlot;

            lhSlot = valueAxis.getSlot(value.low, value.high);
            oSlot = valueAxis.getSlot(value.open, value.open);
            cSlot = valueAxis.getSlot(value.close, value.close);

            oSlot.x1 = cSlot.x1 = lhSlot.x1 = box.x1;
            oSlot.x2 = cSlot.x2 = lhSlot.x2 = box.x2;

            mid = lhSlot.center().x;

            oPoints.push(Point2D(oSlot.x1, oSlot.y1));
            oPoints.push(Point2D(mid, oSlot.y1));
            cPoints.push(Point2D(mid, cSlot.y1));
            cPoints.push(Point2D(cSlot.x2, cSlot.y1));
            lhPoints.push(Point2D(mid, lhSlot.y1));
            lhPoints.push(Point2D(mid, lhSlot.y2));

            point.oPoints = oPoints;
            point.cPoints = cPoints;
            point.lhPoints = lhPoints;

            point.box = lhSlot.clone().wrap(oSlot.clone().wrap(cSlot));

            point.reflowNote();
        },

        getViewElements: function(view) {
            var point = this,
                options = point.options,
                elements = [],
                lineOptions = options.line,
                lineStyle = {
                    strokeOpacity: lineOptions.opacity || options.opacity,
                    zIndex: -1,
                    strokeWidth: lineOptions.width,
                    stroke: options.color || lineOptions.color,
                    dashType: lineOptions.dashType
                };

            elements.push(point.createOverlayRect(view, options));
            elements.push(view.createPolyline(point.oPoints, true, lineStyle));
            elements.push(view.createPolyline(point.cPoints, true, lineStyle));
            elements.push(view.createPolyline(point.lhPoints, true, lineStyle));

            append(elements,
                ChartElement.fn.getViewElements.call(point, view)
            );

            return elements;
        },

        highlightOverlay: function(view) {
            var point = this,
                pointOptions = point.options,
                highlight = pointOptions.highlight,
                data = { data: { modelId: pointOptions.modelId } },
                lineStyle = deepExtend(data, {
                    strokeWidth: highlight.line.width,
                    strokeOpacity: highlight.line.opacity,
                    stroke: highlight.line.color || point.color
                }),
                group = view.createGroup();

            group.children.push(view.createPolyline(point.oPoints, true, lineStyle));
            group.children.push(view.createPolyline(point.cPoints, true, lineStyle));
            group.children.push(view.createPolyline(point.lhPoints, true, lineStyle));

            return group;
        }
    });

    var OHLCChart = CandlestickChart.extend({
        pointType: function() {
            return OHLCPoint;
        }
    });

    var BoxPlotChart = CandlestickChart.extend({
        addValue: function(data, category, categoryIx, series, seriesIx) {
            var chart = this,
                options = chart.options,
                children = chart.children,
                pointColor = data.fields.color || series.color,
                value = data.valueFields,
                valueParts = chart.splitValue(value),
                hasValue = areNumbers(valueParts),
                categoryPoints = chart.categoryPoints[categoryIx],
                dataItem = series.data[categoryIx],
                point, cluster;

            if (!categoryPoints) {
                chart.categoryPoints[categoryIx] = categoryPoints = [];
            }

            if (hasValue) {
                point = chart.createPoint(
                    data, category, categoryIx,
                    deepExtend({}, series, { color: pointColor })
                );
            }

            cluster = children[categoryIx];
            if (!cluster) {
                cluster = new ClusterLayout({
                    vertical: options.invertAxes,
                    gap: options.gap,
                    spacing: options.spacing
                });
                chart.append(cluster);
            }

            if (point) {
                chart.updateRange(value, categoryIx, series);

                cluster.append(point);

                point.categoryIx = categoryIx;
                point.category = category;
                point.series = series;
                point.seriesIx = seriesIx;
                point.owner = chart;
                point.dataItem = dataItem;
            }

            chart.points.push(point);
            categoryPoints.push(point);
        },

        pointType: function() {
            return BoxPlot;
        },

        splitValue: function(value) {
            return [
                value.lower, value.q1, value.median,
                value.q3, value.upper
            ];
        },

        updateRange: function(value, categoryIx, series) {
            var chart = this,
                axisName = series.axis,
                axisRange = chart.valueAxisRanges[axisName],
                parts = chart.splitValue(value).concat(
                    chart.filterOutliers(value.outliers));

            if (defined(value.mean)) {
                parts = parts.concat(value.mean);
            }

            axisRange = chart.valueAxisRanges[axisName] =
                axisRange || { min: MAX_VALUE, max: MIN_VALUE };

            axisRange = chart.valueAxisRanges[axisName] = {
                min: math.min.apply(math, parts.concat([axisRange.min])),
                max: math.max.apply(math, parts.concat([axisRange.max]))
            };
        },

        formatPointValue: function(point, format) {
            var value = point.value;

            return autoFormat(format,
                value.lower, value.q1, value.median,
                value.q3, value.upper, value.mean, point.category
            );
        },

        filterOutliers: function(items) {
            var length = (items || []).length,
                result = [],
                i, item;

            for (i = 0; i < length; i++) {
                item = items[i];
                if (defined(item)) {
                    appendIfNotNull(result, item);
                }
            }

            return result;
        }
    });

    var BoxPlot = Candlestick.extend({
        init: function(value, options) {
            var point = this;

            ChartElement.fn.init.call(point, options);
            point.value = value;
            point.id = uniqueId();
            point.enableDiscovery();

            point.createNote();
        },

        options: {
            border: {
                _brightness: 0.8
            },
            line: {
                width: 2
            },
            mean: {
                width: 2,
                dashType: "dash"
            },
            overlay: {
                gradient: GLASS
            },
            tooltip: {
                format: "<table style='text-align: left;'>" +
                        "<th colspan='2'>{6:d}</th>" +
                        "<tr><td>Lower:</td><td>{0:C}</td></tr>" +
                        "<tr><td>Q1:</td><td>{1:C}</td></tr>" +
                        "<tr><td>Median:</td><td>{2:C}</td></tr>" +
                        "<tr><td>Mean:</td><td>{5:C}</td></tr>" +
                        "<tr><td>Q3:</td><td>{3:C}</td></tr>" +
                        "<tr><td>Upper:</td><td>{4:C}</td></tr>" +
                        "</table>"
            },
            highlight: {
                opacity: 1,
                border: {
                    width: 1,
                    opacity: 1
                },
                line: {
                    width: 1,
                    opacity: 1
                }
            },
            notes: {
                visible: true,
                label: {}
            },
            outliers: {
                visible: true,
                size: LINE_MARKER_SIZE,
                type: CROSS,
                background: WHITE,
                border: {
                    width: 2,
                    opacity: 1
                },
                opacity: 0
            },
            extremes: {
                visible: true,
                size: LINE_MARKER_SIZE,
                type: CIRCLE,
                background: WHITE,
                border: {
                    width: 2,
                    opacity: 1
                },
                opacity: 0
            }
        },

        reflow: function(box) {
            var point = this,
                options = point.options,
                chart = point.owner,
                value = point.value,
                valueAxis = chart.seriesValueAxis(options),
                points = [], mid, whiskerSlot, boxSlot, medianSlot, meanSlot;

            boxSlot = valueAxis.getSlot(value.q1, value.q3);
            point.boxSlot = boxSlot;

            whiskerSlot = valueAxis.getSlot(value.lower, value.upper);
            medianSlot = valueAxis.getSlot(value.median);

            boxSlot.x1 = whiskerSlot.x1 = box.x1;
            boxSlot.x2 = whiskerSlot.x2 = box.x2;

            if (value.mean) {
                meanSlot = valueAxis.getSlot(value.mean);
                point.meanPoints = [ Point2D(box.x1, meanSlot.y1), Point2D(box.x2, meanSlot.y1) ];
            }

            mid = whiskerSlot.center().x;
            points.push([
                [ Point2D(mid - 5, whiskerSlot.y1), Point2D(mid + 5, whiskerSlot.y1) ],
                [ Point2D(mid, whiskerSlot.y1), Point2D(mid, boxSlot.y1) ]
            ]);
            points.push([
                [ Point2D(mid - 5, whiskerSlot.y2), Point2D(mid + 5, whiskerSlot.y2) ],
                [ Point2D(mid, boxSlot.y2), Point2D(mid, whiskerSlot.y2) ]
            ]);

            point.whiskerPoints = points;

            point.medianPoints = [ Point2D(box.x1, medianSlot.y1), Point2D(box.x2, medianSlot.y1) ];

            point.box = whiskerSlot.clone().wrap(boxSlot);
            point.createOutliers();

            point.reflowNote();
        },

        createOutliers: function() {
            var point = this,
                options = point.options,
                markers = options.markers || {},
                value = point.value,
                outliers = value.outliers || [],
                valueAxis = point.owner.seriesValueAxis(options),
                outerFence = math.abs(value.q3 - value.q1) * 3,
                markersBorder, markerBox, element, outlierValue, i;

            point.outliers = [];

            for (i = 0; i < outliers.length; i++) {
                outlierValue = outliers[i];
                if (outlierValue < value.q3 + outerFence && outlierValue > value.q1 - outerFence) {
                    markers = options.outliers;
                } else {
                    markers = options.extremes;
                }
                markersBorder = deepExtend({}, markers.border);

                if (!defined(markersBorder.color)) {
                    if (defined(point.options.color)) {
                        markersBorder.color = point.options.color;
                    } else {
                        markersBorder.color =
                            new Color(markers.background).brightness(BAR_BORDER_BRIGHTNESS).toHex();
                    }
                }

                element = new ShapeElement({
                    id: point.id,
                    type: markers.type,
                    width: markers.size,
                    height: markers.size,
                    rotation: markers.rotation,
                    background: markers.background,
                    border: markersBorder,
                    opacity: markers.opacity
                });

                markerBox = valueAxis.getSlot(outlierValue).move(point.box.center().x);
                point.box = point.box.wrap(markerBox);
                element.reflow(markerBox);
                point.outliers.push(element);
            }
        },

        getViewElements: function(view) {
            var point = this,
                group = view.createGroup({
                    animation: {
                        type: CLIP
                    }
                }),
                elements = point.render(view, point.options);

            append(elements,
                ChartElement.fn.getViewElements.call(point, view)
            );

            group.children = elements;

            return [ group ];
        },

        render: function(view, renderOptions) {
            var point = this,
                elements = [],
                i, element;

            elements.push(point.createBody(view, renderOptions));
            elements.push(point.createWhisker(view, point.whiskerPoints[0], renderOptions));
            elements.push(point.createWhisker(view, point.whiskerPoints[1], renderOptions));
            elements.push(point.createMedian(view, renderOptions));
            if (point.meanPoints) {
                elements.push(point.createMean(view, renderOptions));
            }
            elements.push(point.createOverlayRect(view, renderOptions));
            if (point.outliers.length) {
                for (i = 0; i < point.outliers.length; i++) {
                    element = point.outliers[i];
                    elements.push(element.getViewElements(view)[0]);
                }
            }

            return elements;
        },

        createWhisker: function(view, points, options) {
            return view.createMultiLine(points, {
                    strokeOpacity: valueOrDefault(options.line.opacity, options.opacity),
                    strokeWidth: options.line.width,
                    stroke: options.line.color || options.color,
                    dashType: options.line.dashType,
                    strokeLineCap: "butt",
                    data: { data: { modelId: this.modelId } }
                });
        },

        createMedian: function(view) {
            var point = this,
                options = point.options;

            return view.createPolyline(point.medianPoints, false, {
                    strokeOpacity: valueOrDefault(options.median.opacity, options.opacity),
                    strokeWidth: options.median.width,
                    stroke: options.median.color || options.color,
                    dashType: options.median.dashType,
                    strokeLineCap: "butt",
                    data: { data: { modelId: this.modelId } }
                });
        },

        createBody: function(view, options) {
            var point = this,
                border = options.border.width > 0 ? {
                    stroke: options.color || point.getBorderColor(),
                    strokeWidth: options.border.width,
                    dashType: options.border.dashType,
                    strokeOpacity: valueOrDefault(options.border.opacity, options.opacity)
                } : {},
                body = deepExtend({
                    fill: options.color,
                    fillOpacity: options.opacity,
                    data: { data: { modelId: this.modelId } }
                }, border);

            if (options.overlay) {
                body.overlay = deepExtend({
                    rotation: 0
                }, options.overlay);
            }

            return view.createRect(point.boxSlot, body);
        },

        createMean: function(view) {
            var point = this,
                options = point.options;

            return view.createPolyline(point.meanPoints, false, {
                    strokeOpacity: valueOrDefault(options.mean.opacity, options.opacity),
                    strokeWidth: options.mean.width,
                    stroke: options.mean.color || options.color,
                    dashType: options.mean.dashType,
                    strokeLineCap: "butt",
                    data: { data: { modelId: this.modelId } }
                });
        },

        highlightOverlay: function(view) {
            var point = this,
                group = view.createGroup();

            group.children = point.render(view, deepExtend({},
                point.options.highlight, {
                border: {
                    color: point.getBorderColor()
                }
            }));

            return group;
        }
    });
    deepExtend(BoxPlot.fn, PointEventsMixin);

    // TODO: Rename to Segment?
    var PieSegment = ChartElement.extend({
        init: function(value, sector, options) {
            var segment = this;

            segment.value = value;
            segment.sector = sector;

            ChartElement.fn.init.call(segment, options);

            segment.id = uniqueId();
            segment.enableDiscovery();
        },

        options: {
            color: WHITE,
            overlay: {
                gradient: ROUNDED_BEVEL
            },
            border: {
                width: 0.5
            },
            labels: {
                visible: false,
                distance: 35,
                font: DEFAULT_FONT,
                margin: getSpacing(0.5),
                align: CIRCLE,
                zIndex: 1,
                position: OUTSIDE_END
            },
            animation: {
                type: PIE
            },
            highlight: {
                visible: true,
                border: {
                    width: 1
                }
            },
            visible: true
        },

        render: function() {
            var segment = this,
                options = segment.options,
                labels = options.labels,
                labelText = segment.value,
                labelTemplate;

            if (segment._rendered || segment.visible === false) {
                return;
            } else {
                segment._rendered = true;
            }

            if (labels.template) {
                labelTemplate = template(labels.template);
                labelText = labelTemplate({
                    dataItem: segment.dataItem,
                    category: segment.category,
                    value: segment.value,
                    series: segment.series,
                    percentage: segment.percentage
                });
            } else if (labels.format) {
                labelText = autoFormat(labels.format, labelText);
            }

            if (labels.visible && labelText) {
                segment.label = new TextBox(labelText, deepExtend({}, labels, {
                        id: uniqueId(),
                        align: CENTER,
                        vAlign: "",
                        animation: {
                            type: FADEIN,
                            delay: segment.animationDelay
                        }
                    }));

                segment.append(segment.label);
            }
        },

        reflow: function(targetBox) {
            var segment = this;

            segment.render();
            segment.box = targetBox;
            segment.reflowLabel();
        },

        reflowLabel: function() {
            var segment = this,
                sector = segment.sector.clone(),
                options = segment.options,
                label = segment.label,
                labelsOptions = options.labels,
                labelsDistance = labelsOptions.distance,
                angle = sector.middle(),
                lp, x1, labelWidth, labelHeight;

            if (label) {
                labelHeight = label.box.height();
                labelWidth = label.box.width();
                if (labelsOptions.position == CENTER) {
                    sector.r = math.abs((sector.r - labelHeight) / 2) + labelHeight;
                    lp = sector.point(angle);
                    label.reflow(Box2D(lp.x, lp.y - labelHeight / 2, lp.x, lp.y));
                } else if (labelsOptions.position == INSIDE_END) {
                    sector.r = sector.r - labelHeight / 2;
                    lp = sector.point(angle);
                    label.reflow(Box2D(lp.x, lp.y - labelHeight / 2, lp.x, lp.y));
                } else {
                    lp = sector.clone().expand(labelsDistance).point(angle);
                    if (lp.x >= sector.c.x) {
                        x1 = lp.x + labelWidth;
                        label.orientation = RIGHT;
                    } else {
                        x1 = lp.x - labelWidth;
                        label.orientation = LEFT;
                    }
                    label.reflow(Box2D(x1, lp.y - labelHeight, lp.x, lp.y));
                }
            }
        },

        getViewElements: function(view) {
            var segment = this,
                sector = segment.sector,
                options = segment.options,
                borderOptions = options.border || {},
                border = borderOptions.width > 0 ? {
                    stroke: borderOptions.color,
                    strokeWidth: borderOptions.width,
                    strokeOpacity: borderOptions.opacity,
                    dashType: borderOptions.dashType
                } : {},
                elements = [],
                overlay = options.overlay;

            if (overlay) {
                overlay = deepExtend({}, options.overlay, {
                    r: sector.r,
                    ir: sector.ir,
                    cx: sector.c.x,
                    cy: sector.c.y,
                    bbox: sector.getBBox()
                });
            }

            if (segment.value) {
                elements.push(segment.createSegment(view, sector, deepExtend({
                    id: segment.id,
                    fill: options.color,
                    overlay: overlay,
                    fillOpacity: options.opacity,
                    strokeOpacity: options.opacity,
                    animation: deepExtend(options.animation, {
                        delay: segment.animationDelay
                    }),
                    data: { modelId: segment.modelId },
                    zIndex: options.zIndex,
                    singleSegment: (segment.options.data || []).length === 1
                }, border)));
            }

            append(elements,
                ChartElement.fn.getViewElements.call(segment, view)
            );

            return elements;
        },

        createSegment: function(view, sector, options) {
            if (options.singleSegment) {
                return view.createCircle(sector.c, sector.r, options);
            } else {
                return view.createSector(sector, options);
            }
        },

        highlightOverlay: function(view, options) {
            var segment = this,
                highlight = segment.options.highlight || {},
                border = highlight.border || {},
                outlineId = segment.id + OUTLINE_SUFFIX,
                element;

            options = deepExtend({}, options, { id: outlineId });

            if (segment.value !== 0) {
                element = segment.createSegment(view, segment.sector, deepExtend({}, options, {
                    fill: highlight.color,
                    fillOpacity: highlight.opacity,
                    strokeOpacity: border.opacity,
                    strokeWidth: border.width,
                    stroke: border.color,
                    id: null,
                    data: { modelId: segment.modelId }
                }));
            }

            return element;
        },

        tooltipAnchor: function(width, height) {
            var point = this,
                box = point.sector.adjacentBox(TOOLTIP_OFFSET, width, height);

            return new Point2D(box.x1, box.y1);
        },

        formatValue: function(format) {
            var point = this;

            return point.owner.formatPointValue(point, format);
        }
    });
    deepExtend(PieSegment.fn, PointEventsMixin);

    var PieChart = ChartElement.extend({
        init: function(plotArea, options) {
            var chart = this;

            ChartElement.fn.init.call(chart, options);

            chart.plotArea = plotArea;
            chart.points = [];
            chart.legendItems = [];
            chart.render();
        },

        options: {
            startAngle: 90,
            connectors: {
                width: 1,
                color: "#939393",
                padding: 4
            },
            inactiveItems: {
                markers: {},
                labels: {}
            }
        },

        render: function() {
            var chart = this;

            chart.traverseDataPoints(proxy(chart.addValue, chart));
        },

        traverseDataPoints: function(callback) {
            var chart = this,
                options = chart.options,
                colors = chart.plotArea.options.seriesColors || [],
                colorsCount = colors.length,
                series = options.series,
                seriesCount = series.length,
                overlayId = uniqueId(),
                currentSeries, pointData, fields, seriesIx,
                angle, data, anglePerValue, value, explode,
                total, currentAngle, i, pointIx = 0;

            for (seriesIx = 0; seriesIx < seriesCount; seriesIx++) {
                currentSeries = series[seriesIx];
                data = currentSeries.data;
                total = chart.pointsTotal(currentSeries);
                anglePerValue = 360 / total;

                if (defined(currentSeries.startAngle)) {
                    currentAngle = currentSeries.startAngle;
                } else {
                    currentAngle = options.startAngle;
                }

                if (seriesIx != seriesCount - 1) {
                    if (currentSeries.labels.position == OUTSIDE_END) {
                        currentSeries.labels.position = CENTER;
                    }
                }

                for (i = 0; i < data.length; i++) {
                    pointData = SeriesBinder.current.bindPoint(currentSeries, i);
                    value = pointData.valueFields.value;
                    fields = pointData.fields;
                    angle = round(value * anglePerValue, DEFAULT_PRECISION);
                    explode = data.length != 1 && !!fields.explode;
                    if (!isFn(currentSeries.color)) {
                        currentSeries.color = fields.color || colors[i % colorsCount];
                    }

                    callback(value, new Ring(null, 0, 0, currentAngle, angle), {
                        owner: chart,
                        category: fields.category || "",
                        index: pointIx,
                        series: currentSeries,
                        seriesIx: seriesIx,
                        dataItem: data[i],
                        percentage: value / total,
                        explode: explode,
                        visibleInLegend: fields.visibleInLegend,
                        visible: fields.visible,
                        overlay: {
                            id: overlayId + seriesIx
                        },
                        zIndex: seriesCount - seriesIx,
                        animationDelay: chart.animationDelay(i, seriesIx, seriesCount)
                    });

                    if (pointData.fields.visible !== false) {
                        currentAngle += angle;
                    }
                    pointIx++;
                }
                pointIx = 0;
            }
        },

        evalSegmentOptions: function(options, value, fields) {
            var series = fields.series;

            evalOptions(options, {
                value: value,
                series: series,
                dataItem: fields.dataItem,
                category: fields.category,
                percentage: fields.percentage
            }, { defaults: series._defaults, excluded: ["data"] });
        },

        addValue: function(value, sector, fields) {
            var chart = this,
                segment;

            chart.createLegendItem(value, fields);

            if (fields.visible === false) {
                return;
            }

            var segmentOptions = deepExtend({}, fields.series, { index: fields.index });
            chart.evalSegmentOptions(segmentOptions, value, fields);

            segment = new PieSegment(value, sector, segmentOptions);
            extend(segment, fields);
            chart.append(segment);
            chart.points.push(segment);
        },

        createLegendItem: function(value, point) {
            var chart = this,
                labelsOptions = (chart.options.legend || {}).labels || {},
                inactiveItems = (chart.options.legend || {}).inactiveItems || {},
                text, labelTemplate, markerColor, labelColor;

            if (point && point.visibleInLegend !== false) {
                text = point.category || "";
                if ((labelsOptions || {}).template) {
                    labelTemplate = template(labelsOptions.template);
                    text = labelTemplate({
                        text: text,
                        series: point.series,
                        dataItem: point.dataItem,
                        percentage: point.percentage,
                        value: value
                    });
                }

                if (point.visible === false) {
                    markerColor = (inactiveItems.markers || {}).color;
                    labelColor = (inactiveItems.labels || {}).color;
                } else {
                    markerColor = (point.series || {}).color;
                    labelColor = labelsOptions.color;
                }

                if (text) {
                    chart.legendItems.push({
                        pointIndex: point.index,
                        text: text,
                        series: point.series,
                        markerColor: markerColor,
                        labelColor: labelColor
                    });
                }
            }
        },

        pointsTotal: function(series) {
            var data = series.data,
                length = data.length,
                sum = 0,
                value, i, pointData;

            for (i = 0; i < length; i++) {
                pointData = SeriesBinder.current.bindPoint(series, i);
                value = pointData.valueFields.value;
                if (typeof value === "string") {
                    value = parseFloat(value);
                }

                if (value && pointData.fields.visible !== false) {
                    sum += value;
                }
            }

            return sum;
        },

        reflow: function(targetBox) {
            var chart = this,
                options = chart.options,
                box = targetBox.clone(),
                space = 5,
                minWidth = math.min(box.width(), box.height()),
                halfMinWidth = minWidth / 2,
                defaultPadding = minWidth - minWidth * 0.85,
                padding = valueOrDefault(options.padding, defaultPadding),
                newBox = Box2D(box.x1, box.y1,
                    box.x1 + minWidth, box.y1 + minWidth),
                newBoxCenter = newBox.center(),
                seriesConfigs = chart.seriesConfigs || [],
                boxCenter = box.center(),
                points = chart.points,
                count = points.length,
                seriesCount = options.series.length,
                leftSideLabels = [],
                rightSideLabels = [],
                seriesConfig, seriesIndex, label,
                segment, sector, r, i, c;

            padding = padding > halfMinWidth - space ? halfMinWidth - space : padding;
            newBox.translate(boxCenter.x - newBoxCenter.x, boxCenter.y - newBoxCenter.y);
            r = halfMinWidth - padding;
            c = Point2D(
                r + newBox.x1 + padding,
                r + newBox.y1 + padding
            );

            for (i = 0; i < count; i++) {
                segment = points[i];

                sector = segment.sector;
                sector.r = r;
                sector.c = c;
                seriesIndex = segment.seriesIx;
                if (seriesConfigs.length) {
                    seriesConfig = seriesConfigs[seriesIndex];
                    sector.ir = seriesConfig.ir;
                    sector.r = seriesConfig.r;
                }

                if (seriesIndex == seriesCount - 1 && segment.explode) {
                    sector.c = sector.clone().radius(sector.r * 0.15).point(sector.middle());
                }

                segment.reflow(newBox);

                label = segment.label;
                if (label) {
                    if (label.options.position === OUTSIDE_END) {
                        if (seriesIndex == seriesCount - 1) {
                            if (label.orientation === RIGHT) {
                                rightSideLabels.push(label);
                            } else {
                                leftSideLabels.push(label);
                            }
                        }
                    }
                }
            }

            if (leftSideLabels.length > 0) {
                leftSideLabels.sort(chart.labelComparator(true));
                chart.leftLabelsReflow(leftSideLabels);
            }

            if (rightSideLabels.length > 0) {
                rightSideLabels.sort(chart.labelComparator(false));
                chart.rightLabelsReflow(rightSideLabels);
            }

            chart.box = newBox;
        },

        leftLabelsReflow: function(labels) {
            var chart = this,
                distances = chart.distanceBetweenLabels(labels);

            chart.distributeLabels(distances, labels);
        },

        rightLabelsReflow: function(labels) {
            var chart = this,
                distances = chart.distanceBetweenLabels(labels);

            chart.distributeLabels(distances, labels);
        },

        distanceBetweenLabels: function(labels) {
            var chart = this,
                points = chart.points,
                segment = points[points.length - 1],
                sector = segment.sector,
                firstBox = labels[0].box,
                count = labels.length - 1,
                lr = sector.r + segment.options.labels.distance,
                distances = [],
                secondBox, distance, i;

            distance = round(firstBox.y1 - (sector.c.y - lr - firstBox.height() - firstBox.height() / 2));
            distances.push(distance);
            for (i = 0; i < count; i++) {
                firstBox = labels[i].box;
                secondBox = labels[i + 1].box;
                distance = round(secondBox.y1 - firstBox.y2);
                distances.push(distance);
            }
            distance = round(sector.c.y + lr - labels[count].box.y2 - labels[count].box.height() / 2);
            distances.push(distance);

            return distances;
        },

        distributeLabels: function(distances, labels) {
            var chart = this,
                count = distances.length,
                remaining, left, right, i;

            for (i = 0; i < count; i++) {
                left = right = i;
                remaining = -distances[i];
                while (remaining > 0 && (left >= 0 || right < count)) {
                    remaining = chart._takeDistance(distances, i, --left, remaining);
                    remaining = chart._takeDistance(distances, i, ++right, remaining);
                }
            }

            chart.reflowLabels(distances, labels);
        },

        _takeDistance: function(distances, anchor, position, amount) {
            if (distances[position] > 0) {
                var available = math.min(distances[position], amount);
                amount -= available;
                distances[position] -= available;
                distances[anchor] += available;
            }

            return amount;
        },

        reflowLabels: function(distances, labels) {
            var chart = this,
                points = chart.points,
                segment = points[points.length - 1],
                sector = segment.sector,
                labelsCount = labels.length,
                labelOptions = segment.options.labels,
                labelDistance = labelOptions.distance,
                boxY = sector.c.y - (sector.r + labelDistance) - labels[0].box.height(),
                label, boxX, box, i;

            distances[0] += 2;
            for (i = 0; i < labelsCount; i++) {
                label = labels[i];
                boxY += distances[i];
                box = label.box;
                boxX = chart.hAlignLabel(
                    box.x2,
                    sector.clone().expand(labelDistance),
                    boxY,
                    boxY + box.height(),
                    label.orientation == RIGHT);

                if (label.orientation == RIGHT) {
                    if (labelOptions.align !== CIRCLE) {
                        boxX = sector.r + sector.c.x + labelDistance;
                    }
                    label.reflow(Box2D(boxX + box.width(), boxY,
                        boxX, boxY));
                } else {
                    if (labelOptions.align !== CIRCLE) {
                        boxX = sector.c.x - sector.r - labelDistance;
                    }
                    label.reflow(Box2D(boxX - box.width(), boxY,
                        boxX, boxY));
                }

                boxY += box.height();
            }
        },

        getViewElements: function(view) {
            var chart = this,
                options = chart.options,
                connectors = options.connectors,
                points = chart.points,
                connectorLine,
                lines = [],
                count = points.length,
                space = 4,
                sector, angle, connectorPoints, segment,
                seriesIx, label, i;

            for (i = 0; i < count; i++) {
                segment = points[i];
                sector = segment.sector;
                angle = sector.middle();
                label = segment.label;
                seriesIx = { seriesId: segment.seriesIx };

                if (label) {
                    connectorPoints = [];
                    if (label.options.position === OUTSIDE_END && segment.value !== 0) {
                        var box = label.box,
                            centerPoint = sector.c,
                            start = sector.point(angle),
                            middle = Point2D(box.x1, box.center().y),
                            sr, end, crossing;

                        start = sector.clone().expand(connectors.padding).point(angle);
                        connectorPoints.push(start);
                        // TODO: Extract into a method to remove duplication
                        if (label.orientation == RIGHT) {
                            end = Point2D(box.x1 - connectors.padding, box.center().y);
                            crossing = intersection(centerPoint, start, middle, end);
                            middle = Point2D(end.x - space, end.y);
                            crossing = crossing || middle;
                            crossing.x = math.min(crossing.x, middle.x);

                            if (chart.pointInCircle(crossing, sector.c, sector.r + space) ||
                                crossing.x < sector.c.x) {
                                sr = sector.c.x + sector.r + space;
                                if (segment.options.labels.align !== COLUMN) {
                                    if (sr < middle.x) {
                                        connectorPoints.push(Point2D(sr, start.y));
                                    } else {
                                        connectorPoints.push(Point2D(start.x + space * 2, start.y));
                                    }
                                } else {
                                    connectorPoints.push(Point2D(sr, start.y));
                                }
                                connectorPoints.push(Point2D(middle.x, end.y));
                            } else {
                                crossing.y = end.y;
                                connectorPoints.push(crossing);
                            }
                        } else {
                            end = Point2D(box.x2 + connectors.padding, box.center().y);
                            crossing = intersection(centerPoint, start, middle, end);
                            middle = Point2D(end.x + space, end.y);
                            crossing = crossing || middle;
                            crossing.x = math.max(crossing.x, middle.x);

                            if (chart.pointInCircle(crossing, sector.c, sector.r + space) ||
                                crossing.x > sector.c.x) {
                                sr = sector.c.x - sector.r - space;
                                if (segment.options.labels.align !== COLUMN) {
                                    if (sr > middle.x) {
                                        connectorPoints.push(Point2D(sr, start.y));
                                    } else {
                                        connectorPoints.push(Point2D(start.x - space * 2, start.y));
                                    }
                                } else {
                                    connectorPoints.push(Point2D(sr, start.y));
                                }
                                connectorPoints.push(Point2D(middle.x, end.y));
                            } else {
                                crossing.y = end.y;
                                connectorPoints.push(crossing);
                            }
                        }

                        connectorPoints.push(end);
                        connectorLine = view.createPolyline(connectorPoints, false, {
                            id: uniqueId(),
                            stroke: connectors.color,
                            strokeWidth: connectors.width,
                            animation: {
                                type: FADEIN,
                                delay: segment.animationDelay
                            },
                            data: { modelId: segment.modelId }
                        });

                        lines.push(connectorLine);
                    }
                }
            }

            append(lines,
                ChartElement.fn.getViewElements.call(chart, view));

            return lines;
        },

        labelComparator: function (reverse) {
            reverse = (reverse) ? -1 : 1;

            return function(a, b) {
                a = (round(a.parent.sector.middle()) + 270) % 360;
                b = (round(b.parent.sector.middle()) + 270) % 360;
                return (a - b) * reverse;
            };
        },

        hAlignLabel: function(originalX, sector, y1, y2, direction) {
            var cx = sector.c.x,
                cy = sector.c.y,
                r = sector.r,
                t = math.min(math.abs(cy - y1), math.abs(cy - y2));

            if (t > r) {
                return originalX;
            } else {
                return cx + math.sqrt((r * r) - (t * t)) * (direction ? 1 : -1);
            }
        },

        pointInCircle: function(point, c, r) {
            return sqr(c.x - point.x) + sqr(c.y - point.y) < sqr(r);
        },

        formatPointValue: function(point, format) {
            return autoFormat(format, point.value);
        },

        animationDelay: function(categoryIndex) {
            return categoryIndex * PIE_SECTOR_ANIM_DELAY;
        }
    });

    var DonutSegment = PieSegment.extend({
        options: {
            overlay: {
                gradient: ROUNDED_GLASS
            },
            labels: {
                position: CENTER
            },
            animation: {
                type: PIE
            }
        },

        reflowLabel: function() {
            var segment = this,
                sector = segment.sector.clone(),
                options = segment.options,
                label = segment.label,
                labelsOptions = options.labels,
                lp,
                angle = sector.middle(),
                labelHeight;

            if (label) {
                labelHeight = label.box.height();
                if (labelsOptions.position == CENTER) {
                    sector.r -= (sector.r - sector.ir) / 2;
                    lp = sector.point(angle);
                    label.reflow(new Box2D(lp.x, lp.y - labelHeight / 2, lp.x, lp.y));
                } else {
                    PieSegment.fn.reflowLabel.call(segment);
                }
            }
        },

        createSegment: function(view, sector, options) {
            return view.createRing(sector, options);
        }
    });
    deepExtend(DonutSegment.fn, PointEventsMixin);

    var DonutChart = PieChart.extend({
        options: {
            startAngle: 90,
            connectors: {
                width: 1,
                color: "#939393",
                padding: 4
            }
        },

        addValue: function(value, sector, fields) {
            var chart = this,
                segment;

            chart.createLegendItem(value, fields);

            if (!value || fields.visible === false) {
                return;
            }

            var segmentOptions = deepExtend({}, fields.series);
            chart.evalSegmentOptions(segmentOptions, value, fields);

            segment = new DonutSegment(value, sector, segmentOptions);
            extend(segment, fields);
            chart.append(segment);
            chart.points.push(segment);
        },

        reflow: function(targetBox) {
            var chart = this,
                options = chart.options,
                box = targetBox.clone(),
                space = 5,
                minWidth = math.min(box.width(), box.height()),
                halfMinWidth = minWidth / 2,
                defaultPadding = minWidth - minWidth * 0.85,
                padding = valueOrDefault(options.padding, defaultPadding),
                series = options.series,
                currentSeries,
                seriesCount = series.length,
                seriesWithoutSize = 0,
                holeSize, totalSize, size,
                margin = 0, i, r, ir = 0,
                currentSize = 0;

            chart.seriesConfigs = [];
            padding = padding > halfMinWidth - space ? halfMinWidth - space : padding;
            totalSize = halfMinWidth - padding;

            for (i = 0; i < seriesCount; i++) {
                currentSeries = series[i];
                if (i === 0) {
                    if (defined(currentSeries.holeSize)) {
                        holeSize = currentSeries.holeSize;
                        totalSize -= currentSeries.holeSize;
                    }
                }

                if (defined(currentSeries.size)) {
                    totalSize -= currentSeries.size;
                } else {
                    seriesWithoutSize++;
                }

                if (defined(currentSeries.margin) && i != seriesCount - 1) {
                    totalSize -= currentSeries.margin;
                }
            }

            if (!defined(holeSize)) {
                currentSize = (halfMinWidth - padding) / (seriesCount + 0.75);
                holeSize = currentSize * 0.75;
                totalSize -= holeSize;
            }

            ir = holeSize;

            for (i = 0; i < seriesCount; i++) {
                currentSeries = series[i];
                size = valueOrDefault(currentSeries.size, totalSize / seriesWithoutSize);
                ir += margin;
                r = ir + size;
                chart.seriesConfigs.push({ ir: ir, r: r });
                margin = currentSeries.margin || 0;
                ir = r;
            }

            PieChart.fn.reflow.call(chart, targetBox);
        },

        animationDelay: function(categoryIndex, seriesIndex, seriesCount) {
            return categoryIndex * DONUT_SECTOR_ANIM_DELAY +
                (INITIAL_ANIMATION_DURATION * (seriesIndex + 1) / (seriesCount + 1));
        }
    });

    var Pane = BoxElement.extend({
        init: function(options) {
            var pane = this;

            BoxElement.fn.init.call(pane, options);

            options = pane.options;
            pane.id = uniqueId();

            pane.title = Title.buildTitle(options.title, pane, Pane.fn.options.title);

            pane.content = new ChartElement();
            pane.chartContainer = new ChartContainer({}, pane);
            pane.append(pane.content);

            pane.axes = [];
            pane.charts = [];
        },

        options: {
            zIndex: -1,
            shrinkToFit: true,
            title: {
                align: LEFT
            },
            visible: true
        },

        appendAxis: function(axis) {
            var pane = this;

            pane.content.append(axis);
            pane.axes.push(axis);
            axis.pane = pane;
        },

        appendChart: function(chart) {
            var pane = this;
            if (pane.chartContainer.parent !== pane.content) {
                pane.content.append(pane.chartContainer);
            }
            pane.charts.push(chart);
            pane.chartContainer.append(chart);
            chart.pane = pane;
        },

        empty: function() {
            var pane = this,
                plotArea = pane.parent,
                i;

            if (plotArea) {
                for (i = 0; i < pane.axes.length; i++) {
                    plotArea.removeAxis(pane.axes[i]);
                }

                for (i = 0; i < pane.charts.length; i++) {
                    plotArea.removeChart(pane.charts[i]);
                }
            }

            pane.axes = [];
            pane.charts = [];

            pane.content.destroy();
            pane.content.children = [];
            pane.chartContainer.children = [];
        },

        reflow: function(targetBox) {
            var pane = this;

            // Content (such as charts) is rendered, but excluded from reflows
            if (last(pane.children) === pane.content) {
                pane.children.pop();
            }

            BoxElement.fn.reflow.call(pane, targetBox);

            if (pane.title) {
                pane.contentBox.y1 += pane.title.box.height();
            }
        },

        getViewElements: function(view) {
            var pane = this,
                elements = BoxElement.fn.getViewElements.call(pane, view),
                group = view.createGroup({
                    id: pane.id
                }),
                result = [];

            group.children = elements.concat(
                pane.renderGridLines(view),
                pane.content.getViewElements(view)
            );

            pane.view = view;

            if (pane.options.visible) {
                result = [group];
            }

            return result;
        },

        renderGridLines: function(view) {
            var pane = this,
                axes = pane.axes,
                allAxes = axes.concat(pane.parent.axes),
                vGridLines = [],
                hGridLines = [],
                gridLines, i, j, axis,
                vertical, altAxis;

            for (i = 0; i < axes.length; i++) {
                axis = axes[i];
                vertical = axis.options.vertical;
                gridLines = vertical ? vGridLines : hGridLines;

                for (j = 0; j < allAxes.length; j++) {
                    if (gridLines.length === 0) {
                        altAxis = allAxes[j];
                        if (vertical !== altAxis.options.vertical) {
                            append(gridLines, axis.renderGridLines(view, altAxis, axis));
                        }
                    }
                }
            }

            return vGridLines.concat(hGridLines);
        },

        refresh: function() {
            var pane = this,
                view = pane.view;

            if (view) {
                view.replace(pane);
            }
        },

        clipBox: function() {
            return this.chartContainer.clipBox;
        }
    });

    var ChartContainer = ChartElement.extend({
        init: function(options, pane) {
            var container = this;
            ChartElement.fn.init.call(container, options);
            container.pane = pane;
            container.id = uniqueId();
        },

        shouldClip: function () {
            var container = this,
                children = container.children,
                length = children.length,
                i;
            for (i = 0; i < length; i++) {
                if (children[i].options.clip === true) {
                    return true;
                }
            }
            return false;
        },

        _clipBox: function() {
            var container = this,
                pane = container.pane,
                axes = pane.axes,
                length = axes.length,
                clipBox = pane.box.clone(),
                axisValueField, idx,
                lineBox, axis;

            for (idx = 0; idx < length; idx++) {
                axis = axes[idx];
                axisValueField = axis.options.vertical ? Y : X;
                lineBox = axis.lineBox();
                clipBox[axisValueField + 1] = lineBox[axisValueField + 1];
                clipBox[axisValueField + 2] = lineBox[axisValueField + 2];
            }

            return clipBox;
        },

        getViewElements: function (view) {
            var container = this,
                shouldClip = container.shouldClip(),
                group,
                labels,
                result;

            if (shouldClip && !container.clipPathId) {
                container.clipBox = container._clipBox();
                container.clipPathId = uniqueId();
                view.createClipPath(container.clipPathId, container.clipBox);
            }

            if (shouldClip) {
                group = view.createGroup({
                    id: container.id,
                    clipPathId: container.clipPathId
                });
                labels = container.labelViewElements(view);
                group.children = group.children.concat(ChartElement.fn.getViewElements.call(container, view));
                result = [group].concat(labels);
            } else {
                result = ChartElement.fn.getViewElements.call(container, view);
            }

            return result;
        },

        labelViewElements: function(view) {
            var container = this,
                charts = container.children,
                elements = [],
                clipBox = container.clipBox,
                points, point,
                i, j, length;
            for (i = 0; i < charts.length; i++) {
                points = charts[i].points;
                length = points.length;

                for (j = 0; j < length; j++) {
                    point = points[j];
                    if (point && point.label && point.label.options.visible) {
                        if (point.box.overlaps(clipBox)) {
                            if (point.label.alignToClipBox) {
                                point.label.alignToClipBox(clipBox);
                            }
                            append(elements, point.label.getViewElements(view));
                        }
                        point.label.options.visible = false;
                    }
                }
            }

            return elements;
        },

        destroy: function() {
            ChartElement.fn.destroy.call(this);
            delete this.parent;
        }
    });

    var PlotAreaBase = ChartElement.extend({
        init: function(series, options) {
            var plotArea = this;

            ChartElement.fn.init.call(plotArea, options);

            plotArea.series = series;
            plotArea.setSeriesIndexes();
            plotArea.charts = [];
            plotArea.options.legend.items = [];
            plotArea.axes = [];
            plotArea.crosshairs = [];

            plotArea.id = uniqueId();
            plotArea.enableDiscovery();

            plotArea.createPanes();
            plotArea.render();
            plotArea.createCrosshairs();
        },

        options: {
            series: [],
            plotArea: {
                margin: {}
            },
            background: "",
            border: {
                color: BLACK,
                width: 0
            },
            legend: {
                inactiveItems: {
                    labels: {
                        color: "#919191"
                    },
                    markers: {
                        color: "#919191"
                    }
                }
            }
        },

        setSeriesIndexes: function() {
            var series = this.series,
                i, currentSeries;

            for (i = 0; i < series.length; i++) {
                currentSeries = series[i];
                currentSeries.index = i;
            }
        },

        createPanes: function() {
            var plotArea = this,
                panes = [],
                paneOptions = plotArea.options.panes || [],
                i,
                panesLength = math.max(paneOptions.length, 1),
                currentPane;

            for (i = 0; i < panesLength; i++) {
                currentPane = new Pane(paneOptions[i]);
                currentPane.paneIndex = i;

                panes.push(currentPane);
                plotArea.append(currentPane);
            }

            plotArea.panes = panes;
        },

        destroy: function() {
            var plotArea = this,
                charts = plotArea.charts,
                axes = plotArea.axes,
                i;

            for (i = 0; i < charts.length; i++) {
                charts[i].destroy();
            }

            for (i = 0; i < axes.length; i++) {
                axes[i].destroy();
            }

            ChartElement.fn.destroy.call(plotArea);
        },

        createCrosshairs: function(panes) {
            var plotArea = this,
                i, j, pane, axis, currentCrosshair;

            panes = panes || plotArea.panes;
            for (i = 0; i < panes.length; i++) {
                pane = panes[i];
                for (j = 0; j < pane.axes.length; j++) {
                    axis = pane.axes[j];
                    if (axis.options.crosshair && axis.options.crosshair.visible) {
                        currentCrosshair = new Crosshair(axis, axis.options.crosshair);

                        plotArea.crosshairs.push(currentCrosshair);
                        pane.content.append(currentCrosshair);
                    }
                }
            }
        },

        removeCrosshairs: function(pane) {
            var plotArea = this,
               crosshairs = plotArea.crosshairs,
               axes = pane.axes,
               i, j;

            for (i = crosshairs.length - 1; i >= 0; i--) {
                for (j = 0; j < axes.length; j++) {
                    if (crosshairs[i].axis === axes[j]) {
                        crosshairs.splice(i, 1);
                        break;
                    }
                }
            }
        },

        findPane: function(name) {
            var plotArea = this,
                panes = plotArea.panes,
                i, matchingPane;

            for (i = 0; i < panes.length; i++) {
                if (panes[i].options.name === name) {
                    matchingPane = panes[i];
                    break;
                }
            }

            return matchingPane || panes[0];
        },

        findPointPane: function(point) {
            var plotArea = this,
                panes = plotArea.panes,
                i, matchingPane;

            for (i = 0; i < panes.length; i++) {
                if (panes[i].box.containsPoint(point)) {
                    matchingPane = panes[i];
                    break;
                }
            }

            return matchingPane;
        },

        appendAxis: function(axis) {
            var plotArea = this,
                pane = plotArea.findPane(axis.options.pane);

            pane.appendAxis(axis);
            plotArea.axes.push(axis);
            axis.plotArea = plotArea;
        },

        removeAxis: function(axisToRemove) {
            var plotArea = this,
                i, axis,
                filteredAxes = [];

            for (i = 0; i < plotArea.axes.length; i++) {
                axis = plotArea.axes[i];
                if (axisToRemove !== axis) {
                    filteredAxes.push(axis);
                } else {
                    axis.destroy();
                }
            }

            plotArea.axes = filteredAxes;
        },

        appendChart: function(chart, pane) {
            var plotArea = this;

            plotArea.charts.push(chart);
            if (pane) {
                pane.appendChart(chart);
            } else {
                plotArea.append(chart);
            }
        },

        removeChart: function(chartToRemove) {
            var plotArea = this,
                i, chart,
                filteredCharts = [];

            for (i = 0; i < plotArea.charts.length; i++) {
                chart = plotArea.charts[i];
                if (chart !== chartToRemove) {
                    filteredCharts.push(chart);
                } else {
                    chart.destroy();
                }
            }

            plotArea.charts = filteredCharts;
        },

        addToLegend: function(series) {
            var count = series.length,
                data = [],
                i, currentSeries, text,
                legend = this.options.legend,
                labels = legend.labels || {},
                inactiveItems = legend.inactiveItems || {},
                color, labelColor, markerColor, defaults;

            for (i = 0; i < count; i++) {
                currentSeries = series[i];
                if (currentSeries.visibleInLegend === false) {
                    continue;
                }

                text = currentSeries.name || "";
                if (labels.template) {
                    text = template(labels.template)({
                        text: text,
                        series: currentSeries
                    });
                }

                color = currentSeries.color;
                defaults = currentSeries._defaults;
                if (isFn(color) && defaults) {
                    color = defaults.color;
                }

                if (currentSeries.visible === false) {
                    labelColor = inactiveItems.labels.color;
                    markerColor = inactiveItems.markers.color;
                } else {
                    labelColor = labels.color;
                    markerColor = color;
                }

                if (text) {
                    data.push({
                        text: text,
                        labelColor: labelColor,
                        markerColor: markerColor,
                        series: currentSeries,
                        active: currentSeries.visible
                    });
                }
            }

            append(legend.items, data);
        },

        groupAxes: function(panes) {
            var xAxes = [],
                yAxes = [],
                paneAxes, axis, paneIx, axisIx;

            for (paneIx = 0; paneIx < panes.length; paneIx++) {
                paneAxes = panes[paneIx].axes;
                for (axisIx = 0; axisIx < paneAxes.length; axisIx++) {
                    axis = paneAxes[axisIx];
                    if (axis.options.vertical) {
                        yAxes.push(axis);
                    } else {
                        xAxes.push(axis);
                    }
                }
            }

            return { x: xAxes, y: yAxes, any: xAxes.concat(yAxes) };
        },

        groupSeriesByPane: function() {
            var plotArea = this,
                series = plotArea.series,
                seriesByPane = {},
                i, pane, currentSeries;

            for (i = 0; i < series.length; i++) {
                currentSeries = series[i];
                pane = plotArea.seriesPaneName(currentSeries);

                if (seriesByPane[pane]) {
                    seriesByPane[pane].push(currentSeries);
                } else {
                    seriesByPane[pane] = [currentSeries];
                }
            }

            return seriesByPane;
        },

        filterVisibleSeries: function(series) {
            var i, currentSeries,
                result = [];

            for (i = 0; i < series.length; i++) {
                currentSeries = series[i];
                if (currentSeries.visible !== false) {
                    result.push(currentSeries);
                }
            }

            return result;
        },

        reflow: function(targetBox) {
            var plotArea = this,
                options = plotArea.options.plotArea,
                panes = plotArea.panes,
                margin = getSpacing(options.margin);

            plotArea.box = targetBox.clone().unpad(margin);
            plotArea.reflowPanes();

            plotArea.reflowAxes(panes);
            plotArea.reflowCharts(panes);
        },

        redraw: function(panes) {
            var plotArea = this,
                i;

            panes = [].concat(panes);

            for (i = 0; i < panes.length; i++) {
                plotArea.removeCrosshairs(panes[i]);
                panes[i].empty();
            }

            plotArea.render(panes);
            plotArea.reflowAxes(plotArea.panes);
            plotArea.reflowCharts(panes);

            plotArea.createCrosshairs(panes);

            for (i = 0; i < panes.length; i++) {
                panes[i].refresh();
            }
        },

        axisCrossingValues: function(axis, crossingAxes) {
            var options = axis.options,
                crossingValues = [].concat(
                    options.axisCrossingValues || options.axisCrossingValue
                ),
                valuesToAdd = crossingAxes.length - crossingValues.length,
                defaultValue = crossingValues[0] || 0,
                i;

            for (i = 0; i < valuesToAdd; i++) {
                crossingValues.push(defaultValue);
            }

            return crossingValues;
        },

        alignAxisTo: function(axis, targetAxis, crossingValue, targetCrossingValue) {
            var slot = axis.getSlot(crossingValue, crossingValue, true),
                slotEdge = axis.options.reverse ? 2 : 1,
                targetSlot = targetAxis.getSlot(targetCrossingValue, targetCrossingValue, true),
                targetEdge = targetAxis.options.reverse ? 2 : 1,
                axisBox = axis.box.translate(
                    targetSlot[X + targetEdge] - slot[X + slotEdge],
                    targetSlot[Y + targetEdge] - slot[Y + slotEdge]
                );

            if (axis.pane !== targetAxis.pane) {
                axisBox.translate(0, axis.pane.box.y1 - targetAxis.pane.box.y1);
            }

            axis.reflow(axisBox);
        },

        alignAxes: function(xAxes, yAxes) {
            var plotArea = this,
                xAnchor = xAxes[0],
                yAnchor = yAxes[0],
                xAnchorCrossings = plotArea.axisCrossingValues(xAnchor, yAxes),
                yAnchorCrossings = plotArea.axisCrossingValues(yAnchor, xAxes),
                leftAnchors = {},
                rightAnchors = {},
                topAnchors = {},
                bottomAnchors = {},
                pane, paneId, axis, i;

            for (i = 0; i < yAxes.length; i++) {
                axis = yAxes[i];
                pane = axis.pane;
                paneId = pane.id;
                plotArea.alignAxisTo(axis, xAnchor, yAnchorCrossings[i], xAnchorCrossings[i]);

                if (axis.options._overlap) {
                    continue;
                }

                if (round(axis.lineBox().x1) === round(xAnchor.lineBox().x1)) {
                    if (leftAnchors[paneId]) {
                        axis.reflow(axis.box
                            .alignTo(leftAnchors[paneId].box, LEFT)
                            .translate(-axis.options.margin, 0)
                        );
                    }

                    leftAnchors[paneId] = axis;
                }

                if (round(axis.lineBox().x2) === round(xAnchor.lineBox().x2)) {
                    if (!axis._mirrored) {
                        axis.options.labels.mirror = !axis.options.labels.mirror;
                        axis._mirrored = true;
                    }
                    plotArea.alignAxisTo(axis, xAnchor, yAnchorCrossings[i], xAnchorCrossings[i]);

                    if (rightAnchors[paneId]) {
                        axis.reflow(axis.box
                            .alignTo(rightAnchors[paneId].box, RIGHT)
                            .translate(axis.options.margin, 0)
                        );
                    }

                    rightAnchors[paneId] = axis;
                }

                if (i !== 0 && yAnchor.pane === axis.pane) {
                    axis.alignTo(yAnchor);
                }
            }

            for (i = 0; i < xAxes.length; i++) {
                axis = xAxes[i];
                pane = axis.pane;
                paneId = pane.id;
                plotArea.alignAxisTo(axis, yAnchor, xAnchorCrossings[i], yAnchorCrossings[i]);

                if (axis.options._overlap) {
                    continue;
                }

                if (round(axis.lineBox().y1) === round(yAnchor.lineBox().y1)) {
                    if (!axis._mirrored) {
                        axis.options.labels.mirror = !axis.options.labels.mirror;
                        axis._mirrored = true;
                    }
                    plotArea.alignAxisTo(axis, yAnchor, xAnchorCrossings[i], yAnchorCrossings[i]);

                    if (topAnchors[paneId]) {
                        axis.reflow(axis.box
                            .alignTo(topAnchors[paneId].box, TOP)
                            .translate(0, -axis.options.margin)
                        );
                    }

                    topAnchors[paneId] = axis;
                }

                if (round(axis.lineBox().y2, COORD_PRECISION) === round(yAnchor.lineBox().y2, COORD_PRECISION)) {
                    if (bottomAnchors[paneId]) {
                        axis.reflow(axis.box
                            .alignTo(bottomAnchors[paneId].box, BOTTOM)
                            .translate(0, axis.options.margin)
                        );
                    }

                    bottomAnchors[paneId] = axis;
                }

                if (i !== 0) {
                    axis.alignTo(xAnchor);
                }
            }
        },

        shrinkAxisWidth: function(panes) {
            var plotArea = this,
                axes = plotArea.groupAxes(panes).any,
                axisBox = axisGroupBox(axes),
                overflowX = 0,
                i, currentPane, currentAxis;

            for (i = 0; i < panes.length; i++) {
                currentPane = panes[i];

                if (currentPane.axes.length > 0) {
                    overflowX = math.max(
                        overflowX,
                        axisBox.width() - currentPane.contentBox.width()
                    );
                }
            }

            for (i = 0; i < axes.length; i++) {
                currentAxis = axes[i];

                if (!currentAxis.options.vertical) {
                    currentAxis.reflow(currentAxis.box.shrink(overflowX, 0));
                }
            }
        },

        shrinkAxisHeight: function(panes) {
            var i, currentPane, axes,
                overflowY, j, currentAxis;

            for (i = 0; i < panes.length; i++) {
                currentPane = panes[i];
                axes = currentPane.axes;
                overflowY = math.max(
                    0,
                    axisGroupBox(axes).height() - currentPane.contentBox.height()
                );

                for (j = 0; j < axes.length; j++) {
                    currentAxis = axes[j];

                    if (currentAxis.options.vertical) {
                        currentAxis.reflow(
                            currentAxis.box.shrink(0, overflowY)
                        );
                    }
                }
            }
        },

        fitAxes: function(panes) {
            var plotArea = this,
                axes = plotArea.groupAxes(panes).any,
                offsetX = 0,
                paneAxes, paneBox, axisBox, offsetY,
                currentPane, currentAxis, i, j;

            for (i = 0; i < panes.length; i++) {
                currentPane = panes[i];
                paneAxes = currentPane.axes;
                paneBox = currentPane.contentBox;

                if (paneAxes.length > 0) {
                    axisBox = axisGroupBox(paneAxes);

                    // OffsetX is calculated and applied globally
                    offsetX = math.max(offsetX, paneBox.x1 - axisBox.x1);

                    // OffsetY is calculated and applied per pane
                    offsetY = math.max(paneBox.y1 - axisBox.y1, paneBox.y2 - axisBox.y2);

                    for (j = 0; j < paneAxes.length; j++) {
                        currentAxis = paneAxes[j];

                        currentAxis.reflow(
                            currentAxis.box.translate(0, offsetY)
                        );
                    }
                }
            }

            for (i = 0; i < axes.length; i++) {
                currentAxis = axes[i];

                currentAxis.reflow(
                    currentAxis.box.translate(offsetX, 0)
                );
            }
        },

        reflowAxes: function(panes) {
            var plotArea = this,
                i,
                axes = plotArea.groupAxes(panes);

            for (i = 0; i < panes.length; i++) {
                plotArea.reflowPaneAxes(panes[i]);
            }

            if (axes.x.length > 0 && axes.y.length > 0) {
                plotArea.alignAxes(axes.x, axes.y);
                plotArea.shrinkAxisWidth(panes);
                plotArea.alignAxes(axes.x, axes.y);
                plotArea.shrinkAxisHeight(panes);
                plotArea.alignAxes(axes.x, axes.y);
                plotArea.fitAxes(panes);
            }
        },

        reflowPaneAxes: function(pane) {
            var axes = pane.axes,
                i,
                length = axes.length;

            if (length > 0) {
                for (i = 0; i < length; i++) {
                    axes[i].reflow(pane.contentBox);
                }
            }
        },

        reflowCharts: function(panes) {
            var plotArea = this,
                charts = plotArea.charts,
                count = charts.length,
                box = plotArea.box,
                chartPane, i;

            for (i = 0; i < count; i++) {
                chartPane = charts[i].pane;
                if (!chartPane || inArray(chartPane, panes)) {
                    charts[i].reflow(box);
                }
            }
        },

        reflowPanes: function() {
            var plotArea = this,
                box = plotArea.box,
                panes = plotArea.panes,
                panesLength = panes.length,
                i, currentPane, paneBox,
                remainingHeight = box.height(),
                remainingPanes = panesLength,
                autoHeightPanes = 0,
                top = box.y1,
                height, percents;

            for (i = 0; i < panesLength; i++) {
                currentPane = panes[i];
                height = currentPane.options.height;

                currentPane.options.width = box.width();

                if (!currentPane.options.height) {
                    autoHeightPanes++;
                } else {
                    if (height.indexOf && height.indexOf("%")) {
                        percents = parseInt(height, 10) / 100;
                        currentPane.options.height = percents * box.height();
                    }

                    currentPane.reflow(box.clone());

                    remainingHeight -= currentPane.options.height;
                }
            }

            for (i = 0; i < panesLength; i++) {
                currentPane = panes[i];

                if (!currentPane.options.height) {
                    currentPane.options.height = remainingHeight / autoHeightPanes;
                }
            }

            for (i = 0; i < panesLength; i++) {
                currentPane = panes[i];

                paneBox = box
                    .clone()
                    .move(box.x1, top);

                currentPane.reflow(paneBox);

                remainingPanes--;
                top += currentPane.options.height;
            }
        },

        backgroundBox: function() {
            var plotArea = this,
                axes = plotArea.axes,
                axesCount = axes.length,
                lineBox, box, i, j, axisA, axisB;

            for (i = 0; i < axesCount; i++) {
                axisA = axes[i];

                for (j = 0; j < axesCount; j++) {
                    axisB = axes[j];

                    if (axisA.options.vertical !== axisB.options.vertical) {
                        lineBox = axisA.lineBox().clone().wrap(axisB.lineBox());

                        if (!box) {
                            box = lineBox;
                        } else {
                            box = box.wrap(lineBox);
                        }
                    }
                }
            }

            return box || plotArea.box;
        },

        getViewElements: function(view) {
            var plotArea = this,
                bgBox = plotArea.backgroundBox(),
                options = plotArea.options,
                userOptions = options.plotArea,
                border = userOptions.border || {},
                elements = ChartElement.fn.getViewElements.call(plotArea, view);

            append(elements, [
                view.createRect(bgBox, {
                    fill: userOptions.background,
                    fillOpacity: userOptions.opacity,
                    zIndex: -2,
                    strokeWidth: 0.1
                }),
                view.createRect(bgBox, {
                    id: plotArea.id,
                    data: { modelId: plotArea.modelId },
                    stroke: border.width ? border.color : "",
                    strokeWidth: border.width,
                    fill: WHITE,
                    fillOpacity: 0,
                    zIndex: -1,
                    dashType: border.dashType
                })
            ]);

            return elements;
        },

        pointsByCategoryIndex: function(categoryIndex) {
            var charts = this.charts,
                result = [],
                i, j, points, point, chart;

            if (categoryIndex !== null) {
                for (i = 0; i < charts.length; i++) {
                    chart = charts[i];
                    if (chart.pane.options.name === "_navigator") {
                        continue;
                    }

                    points = charts[i].categoryPoints[categoryIndex];
                    if (points && points.length) {
                        for (j = 0; j < points.length; j++) {
                            point = points[j];
                            if (point && defined(point.value) && point.value !== null) {
                                result.push(point);
                            }
                        }
                    }
                }
            }

            return result;
        },

        pointsBySeriesIndex: function(seriesIndex) {
            var charts = this.charts,
                result = [],
                points, point, i, j, chart;

            for (i = 0; i < charts.length; i++) {
                chart = charts[i];
                points = chart.points;
                for (j = 0; j < points.length; j++) {
                    point = points[j];
                    if (point && point.options.index === seriesIndex) {
                        result.push(point);
                    }
                }
            }

            return result;
        },

        paneByPoint: function(point) {
            var plotArea = this,
                panes = plotArea.panes,
                pane, i;

            for (i = 0; i < panes.length; i++) {
                pane = panes[i];
                if (pane.box.containsPoint(point)) {
                    return pane;
                }
            }
        }
    });

    var CategoricalPlotArea = PlotAreaBase.extend({
        init: function(series, options) {
            var plotArea = this;

            plotArea.namedCategoryAxes = {};
            plotArea.namedValueAxes = {};
            plotArea.valueAxisRangeTracker = new AxisGroupRangeTracker();

            if (series.length > 0) {
                plotArea.invertAxes = inArray(
                    series[0].type, [BAR, BULLET, VERTICAL_LINE, VERTICAL_AREA]
                );

                for (var i = 0; i < series.length; i++) {
                    var stack = series[i].stack;
                    if (stack && stack.type === "100%") {
                        plotArea.stack100 = true;
                        break;
                    }
                }
            }

            PlotAreaBase.fn.init.call(plotArea, series, options);
        },

        options: {
            categoryAxis: {
                categories: []
            },
            valueAxis: {}
        },

        render: function(panes) {
            var plotArea = this;

            panes = panes || plotArea.panes;

            plotArea.createCategoryAxes(panes);
            plotArea.aggregateCategories(panes);
            plotArea.createCharts(panes);
            plotArea.createValueAxes(panes);
        },

        removeAxis: function(axis) {
            var plotArea = this,
                axisName = axis.options.name;

            PlotAreaBase.fn.removeAxis.call(plotArea, axis);

            if (axis instanceof CategoryAxis) {
                delete plotArea.namedCategoryAxes[axisName];
            } else {
                plotArea.valueAxisRangeTracker.reset(axisName);
                delete plotArea.namedValueAxes[axisName];
            }

            if (axis === plotArea.categoryAxis) {
                delete plotArea.categoryAxis;
            }

            if (axis === plotArea.valueAxis) {
                delete plotArea.valueAxis;
            }
        },

        createCharts: function(panes) {
            var plotArea = this,
                seriesByPane = plotArea.groupSeriesByPane(),
                i, pane, paneSeries, filteredSeries;

            for (i = 0; i < panes.length; i++) {
                pane = panes[i];
                paneSeries = seriesByPane[pane.options.name || "default"] || [];
                plotArea.addToLegend(paneSeries);
                filteredSeries = plotArea.filterVisibleSeries(paneSeries);

                if (!filteredSeries) {
                    continue;
                }

                plotArea.createAreaChart(
                    filterSeriesByType(filteredSeries, [AREA, VERTICAL_AREA]),
                    pane
                );

                plotArea.createBarChart(
                    filterSeriesByType(filteredSeries, [COLUMN, BAR]),
                    pane
                );

                plotArea.createLineChart(
                    filterSeriesByType(filteredSeries, [LINE, VERTICAL_LINE]),
                    pane
                );

                plotArea.createCandlestickChart(
                    filterSeriesByType(filteredSeries, CANDLESTICK),
                    pane
                );

                plotArea.createBoxPlotChart(
                    filterSeriesByType(filteredSeries, BOX_PLOT),
                    pane
                );

                plotArea.createOHLCChart(
                    filterSeriesByType(filteredSeries, OHLC),
                    pane
                );

                plotArea.createBulletChart(
                    filterSeriesByType(filteredSeries, [BULLET, VERTICAL_BULLET]),
                    pane
                );
            }
        },

        aggregateCategories: function(panes) {
            var plotArea = this,
                series = plotArea.srcSeries || plotArea.series,
                processedSeries = [],
                i, currentSeries,
                categoryAxis, axisPane, dateAxis;

            for (i = 0; i < series.length; i++) {
                currentSeries = series[i];
                categoryAxis = plotArea.seriesCategoryAxis(currentSeries);
                axisPane = plotArea.findPane(categoryAxis.options.pane);
                dateAxis = equalsIgnoreCase(categoryAxis.options.type, DATE);

                if ((dateAxis || currentSeries.categoryField) && inArray(axisPane, panes)) {
                    currentSeries = plotArea.aggregateSeries(currentSeries, categoryAxis);
                }

                processedSeries.push(currentSeries);

            }

            plotArea.srcSeries = series;
            plotArea.series = processedSeries;
        },

        aggregateSeries: function(series, categoryAxis) {
            var axisOptions = categoryAxis.options,
                dateAxis = equalsIgnoreCase(categoryAxis.options.type, DATE),
                categories = axisOptions.categories,
                srcCategories = axisOptions.srcCategories || categories,
                srcData = series.data,
                srcPoints = [],
                range = categoryAxis.range(),
                result = deepExtend({}, series),
                aggregatorSeries = deepExtend({}, series),
                i, category, categoryIx,
                data,
                aggregator,
                getFn = getField;

            result.data = data = [];

            if (dateAxis) {
                getFn = getDateField;
            }

            for (i = 0; i < srcData.length; i++) {
                if (series.categoryField) {
                    category = getFn(series.categoryField, srcData[i]);
                } else {
                    category = srcCategories[i];
                }

                categoryIx = categoryAxis.categoryIndex(category, range);
                if (categoryIx > -1) {
                    srcPoints[categoryIx] = srcPoints[categoryIx] || [];
                    srcPoints[categoryIx].push(i);
                }
            }

            aggregator = new SeriesAggregator(
                aggregatorSeries, SeriesBinder.current, DefaultAggregates.current
            );

            for (i = 0; i < categories.length; i++) {
                data[i] = aggregator.aggregatePoints(
                    srcPoints[i], categories[i]
                );
            }

            return result;
        },

        appendChart: function(chart, pane) {
            var plotArea = this,
                series = chart.options.series,
                categoryAxis = plotArea.seriesCategoryAxis(series[0]),
                categories = categoryAxis.options.categories,
                categoriesToAdd = math.max(0, categoriesCount(series) - categories.length);

            while (categoriesToAdd--) {
                categories.push("");
            }

            plotArea.valueAxisRangeTracker.update(chart.valueAxisRanges);

            PlotAreaBase.fn.appendChart.call(plotArea, chart, pane);
        },

        // TODO: Refactor, optionally use series.pane option
        seriesPaneName: function(series) {
            var plotArea = this,
                options = plotArea.options,
                axisName = series.axis,
                axisOptions = [].concat(options.valueAxis),
                axis = $.grep(axisOptions, function(a) { return a.name === axisName; })[0],
                panes = options.panes || [{}],
                defaultPaneName = (panes[0] || {}).name || "default",
                paneName = (axis || {}).pane || defaultPaneName;

            return paneName;
        },

        seriesCategoryAxis: function(series) {
            var plotArea = this,
                axisName = series.categoryAxis,
                axis = axisName ?
                    plotArea.namedCategoryAxes[axisName] :
                    plotArea.categoryAxis;

            if (!axis) {
                throw new Error("Unable to locate category axis with name " + axisName);
            }

            return axis;
        },

        createBarChart: function(series, pane) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                stack = firstSeries.stack,
                isStacked100 = stack && stack.type === "100%",
                barChart = new BarChart(plotArea, {
                    series: series,
                    invertAxes: plotArea.invertAxes,
                    isStacked: stack,
                    isStacked100: isStacked100,
                    clip: !isStacked100,
                    gap: firstSeries.gap,
                    spacing: firstSeries.spacing
                });

            plotArea.appendChart(barChart, pane);
        },

        createBulletChart: function(series, pane) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                bulletChart = new BulletChart(plotArea, {
                    series: series,
                    invertAxes: plotArea.invertAxes,
                    gap: firstSeries.gap,
                    spacing: firstSeries.spacing
                });

            plotArea.appendChart(bulletChart, pane);
        },

        createLineChart: function(series, pane) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                stack = firstSeries.stack,
                isStacked100 = stack && stack.type === "100%",
                lineChart = new LineChart(plotArea, {
                    invertAxes: plotArea.invertAxes,
                    isStacked: stack,
                    isStacked100: isStacked100,
                    clip: !isStacked100,
                    series: series
                });

            plotArea.appendChart(lineChart, pane);
        },

        createAreaChart: function(series, pane) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                stack = firstSeries.stack,
                isStacked100 = stack && stack.type === "100%",
                areaChart = new AreaChart(plotArea, {
                    invertAxes: plotArea.invertAxes,
                    isStacked: stack,
                    isStacked100: isStacked100,
                    clip: !isStacked100,
                    series: series
                });

            plotArea.appendChart(areaChart, pane);
        },

        createOHLCChart: function(series, pane) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                chart = new OHLCChart(plotArea, {
                    invertAxes: plotArea.invertAxes,
                    gap: firstSeries.gap,
                    series: series,
                    spacing: firstSeries.spacing
                });

            plotArea.appendChart(chart, pane);
        },

        createCandlestickChart: function(series, pane) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                chart = new CandlestickChart(plotArea, {
                    invertAxes: plotArea.invertAxes,
                    gap: firstSeries.gap,
                    series: series,
                    spacing: firstSeries.spacing
                });

            plotArea.appendChart(chart, pane);
        },

        createBoxPlotChart: function(series, pane) {
            if (series.length === 0) {
                return;
            }

            var plotArea = this,
                firstSeries = series[0],
                chart = new BoxPlotChart(plotArea, {
                    invertAxes: plotArea.invertAxes,
                    gap: firstSeries.gap,
                    series: series,
                    spacing: firstSeries.spacing
                });

            plotArea.appendChart(chart, pane);
        },

        axisRequiresRounding: function(categoryAxisName, categoryAxisIndex) {
            var plotArea = this,
                centeredSeries = filterSeriesByType(plotArea.series, EQUALLY_SPACED_SERIES),
                seriesIx,
                seriesAxis;

            for (seriesIx = 0; seriesIx < centeredSeries.length; seriesIx++) {
                seriesAxis = centeredSeries[seriesIx].categoryAxis || "";
                if (seriesAxis === categoryAxisName || (!seriesAxis && categoryAxisIndex === 0)) {
                    return true;
                }
            }
        },

        createCategoryAxes: function(panes) {
            var plotArea = this,
                invertAxes = plotArea.invertAxes,
                definitions = [].concat(plotArea.options.categoryAxis),
                i, axisOptions, axisPane,
                categories, type, name,
                categoryAxis, axes = [],
                primaryAxis;

            for (i = 0; i < definitions.length; i++) {
                axisOptions = definitions[i];
                axisPane = plotArea.findPane(axisOptions.pane);

                if (inArray(axisPane, panes)) {
                    name = axisOptions.name;
                    categories = axisOptions.categories || [];
                    type  = axisOptions.type || "";
                    axisOptions = deepExtend({
                        vertical: invertAxes,
                        axisCrossingValue: invertAxes ? MAX_VALUE : 0
                    }, axisOptions);

                    if (!defined(axisOptions.justified)) {
                        axisOptions.justified = plotArea.isJustified();
                    }

                    if (plotArea.axisRequiresRounding(name, i)) {
                        axisOptions.justified = false;
                        axisOptions.roundToBaseUnit = true;
                    }

                    if (isDateAxis(axisOptions, categories[0])) {
                        categoryAxis = new DateCategoryAxis(axisOptions);
                    } else {
                        categoryAxis = new CategoryAxis(axisOptions);
                    }

                    if (name) {
                        if (plotArea.namedCategoryAxes[name]) {
                            throw new Error(
                                "Category axis with name " + name + " is already defined"
                            );
                        }
                        plotArea.namedCategoryAxes[name] = categoryAxis;
                    }

                    categoryAxis.axisIndex = i;
                    axes.push(categoryAxis);
                    plotArea.appendAxis(categoryAxis);
                }
            }

            primaryAxis = plotArea.categoryAxis || axes[0];
            plotArea.categoryAxis = primaryAxis;

            if (invertAxes) {
                plotArea.axisY = primaryAxis;
            } else {
                plotArea.axisX = primaryAxis;
            }
        },

        isJustified: function() {
            var plotArea = this,
                series = plotArea.series,
                i, currentSeries;

            for (i = 0; i < series.length; i++) {
                currentSeries = series[i];
                if (!inArray(currentSeries.type, [AREA, VERTICAL_AREA])) {
                    return false;
                }
            }

            return true;
        },

        createValueAxes: function(panes) {
            var plotArea = this,
                tracker = plotArea.valueAxisRangeTracker,
                defaultRange = tracker.query(),
                definitions = [].concat(plotArea.options.valueAxis),
                invertAxes = plotArea.invertAxes,
                baseOptions = { vertical: !invertAxes },
                axisOptions, axisPane, valueAxis,
                primaryAxis, axes = [], range,
                axisType, defaultAxisRange,
                name, i;

            if (plotArea.stack100) {
                baseOptions.roundToMajorUnit = false;
                baseOptions.labels = { format: "P0" };
            }

            for (i = 0; i < definitions.length; i++) {
                axisOptions = definitions[i];
                axisPane = plotArea.findPane(axisOptions.pane);

                if (inArray(axisPane, panes)) {
                    name = axisOptions.name;
                    defaultAxisRange = equalsIgnoreCase(axisOptions.type, LOGARITHMIC) ? {min: 0.1, max: 1} : { min: 0, max: 1 };
                    range = tracker.query(name) || defaultRange || defaultAxisRange;

                    if (i === 0 && range && defaultRange) {
                        range.min = math.min(range.min, defaultRange.min);
                        range.max = math.max(range.max, defaultRange.max);
                    }

                    if (equalsIgnoreCase(axisOptions.type, LOGARITHMIC)) {
                        axisType = LogarithmicAxis;
                    } else {
                        axisType = NumericAxis;
                    }

                    valueAxis = new axisType(range.min, range.max,
                        deepExtend({}, baseOptions, axisOptions)
                    );

                    if (name) {
                        if (plotArea.namedValueAxes[name]) {
                            throw new Error(
                                "Value axis with name " + name + " is already defined"
                            );
                        }
                        plotArea.namedValueAxes[name] = valueAxis;
                    }
                    valueAxis.axisIndex = i;

                    axes.push(valueAxis);
                    plotArea.appendAxis(valueAxis);
                }
            }

            primaryAxis = plotArea.valueAxis || axes[0];
            plotArea.valueAxis = primaryAxis;

            if (invertAxes) {
                plotArea.axisX = primaryAxis;
            } else {
                plotArea.axisY = primaryAxis;
            }
        },

        click: function(chart, e) {
            var plotArea = this,
                coords = chart._eventCoordinates(e),
                point = new Point2D(coords.x, coords.y),
                pane = plotArea.pointPane(point),
                allAxes,
                i,
                axis,
                categories = [],
                values = [];

            if (!pane) {
                return;
            }

            allAxes = pane.axes;
            for (i = 0; i < allAxes.length; i++) {
                axis = allAxes[i];
                if (axis.getValue) {
                    appendIfNotNull(values, axis.getValue(point));
                } else {
                    appendIfNotNull(categories, axis.getCategory(point));
                }
            }

            if (categories.length === 0) {
                appendIfNotNull(
                    categories, plotArea.categoryAxis.getCategory(point)
                );
            }

            if (categories.length > 0 && values.length > 0) {
                chart.trigger(PLOT_AREA_CLICK, {
                    element: $(e.target),
                    category: singleItemOrArray(categories),
                    value: singleItemOrArray(values)
                });
            }
        },

        pointPane: function(point) {
            var plotArea = this,
                panes = plotArea.panes,
                currentPane,
                i;

            for (i = 0; i < panes.length; i++) {
                currentPane = panes[i];
                if (currentPane.contentBox.containsPoint(point)) {
                    return currentPane;
                }
            }
        }
    });

    var AxisGroupRangeTracker = Class.extend({
        init: function() {
            var tracker = this;

            tracker.axisRanges = {};
        },

        update: function(chartAxisRanges) {
            var tracker = this,
                axisRanges = tracker.axisRanges,
                range,
                chartRange,
                axisName;

            for (axisName in chartAxisRanges) {
                range = axisRanges[axisName];
                chartRange = chartAxisRanges[axisName];
                axisRanges[axisName] = range =
                    range || { min: MAX_VALUE, max: MIN_VALUE };

                range.min = math.min(range.min, chartRange.min);
                range.max = math.max(range.max, chartRange.max);
            }
        },

        reset: function(axisName) {
            this.axisRanges[axisName] = undefined;
        },

        query: function(axisName) {
            return this.axisRanges[axisName];
        }
    });

    var XYPlotArea = PlotAreaBase.extend({
        init: function(series, options) {
            var plotArea = this;

            plotArea.namedXAxes = {};
            plotArea.namedYAxes = {};

            plotArea.xAxisRangeTracker = new AxisGroupRangeTracker();
            plotArea.yAxisRangeTracker = new AxisGroupRangeTracker();

            PlotAreaBase.fn.init.call(plotArea, series, options);
        },

        options: {
            xAxis: {},
            yAxis: {}
        },

        render: function(panes) {
            var plotArea = this,
                seriesByPane = plotArea.groupSeriesByPane(),
                i, pane, paneSeries, filteredSeries;

            panes = panes || plotArea.panes;

            for (i = 0; i < panes.length; i++) {
                pane = panes[i];
                paneSeries = seriesByPane[pane.options.name || "default"] || [];
                plotArea.addToLegend(paneSeries);
                filteredSeries = plotArea.filterVisibleSeries(paneSeries);

                if (!filteredSeries) {
                    continue;
                }

                plotArea.createScatterChart(
                    filterSeriesByType(filteredSeries, SCATTER),
                    pane
                );

                plotArea.createScatterLineChart(
                    filterSeriesByType(filteredSeries, SCATTER_LINE),
                    pane
                );

                plotArea.createBubbleChart(
                    filterSeriesByType(filteredSeries, BUBBLE),
                    pane
                );
            }

            plotArea.createAxes(panes);
        },

        appendChart: function(chart, pane) {
            var plotArea = this;

            plotArea.xAxisRangeTracker.update(chart.xAxisRanges);
            plotArea.yAxisRangeTracker.update(chart.yAxisRanges);

            PlotAreaBase.fn.appendChart.call(plotArea, chart, pane);
        },

        removeAxis: function(axis) {
            var plotArea = this,
                axisName = axis.options.name;

            PlotAreaBase.fn.removeAxis.call(plotArea, axis);

            if (axis.options.vertical) {
                plotArea.yAxisRangeTracker.reset(axisName);
                delete plotArea.namedYAxes[axisName];
            } else {
                plotArea.xAxisRangeTracker.reset(axisName);
                delete plotArea.namedXAxes[axisName];
            }

            if (axis === plotArea.axisX) {
                delete plotArea.axisX;
            }

            if (axis === plotArea.axisY) {
                delete plotArea.axisY;
            }
        },

        // TODO: Refactor, optionally use series.pane option
        seriesPaneName: function(series) {
            var plotArea = this,
                options = plotArea.options,
                xAxisName = series.xAxis,
                xAxisOptions = [].concat(options.xAxis),
                xAxis = $.grep(xAxisOptions, function(a) { return a.name === xAxisName; })[0],
                yAxisName = series.yAxis,
                yAxisOptions = [].concat(options.yAxis),
                yAxis = $.grep(yAxisOptions, function(a) { return a.name === yAxisName; })[0],
                panes = options.panes || [{}],
                defaultPaneName = panes[0].name || "default",
                paneName = (xAxis || {}).pane || (yAxis || {}).pane || defaultPaneName;

            return paneName;
        },

        createScatterChart: function(series, pane) {
            var plotArea = this;

            if (series.length > 0) {
                plotArea.appendChart(
                    new ScatterChart(plotArea, { series: series }),
                    pane
                );
            }
        },

        createScatterLineChart: function(series, pane) {
            var plotArea = this;

            if (series.length > 0) {
                plotArea.appendChart(
                    new ScatterLineChart(plotArea, { series: series }),
                    pane
                );
            }
        },

        createBubbleChart: function(series, pane) {
            var plotArea = this;

            if (series.length > 0) {
                plotArea.appendChart(
                    new BubbleChart(plotArea, { series: series }),
                    pane
                );
            }
        },

        createXYAxis: function(options, vertical, axisIndex) {
            var plotArea = this,
                axisName = options.name,
                namedAxes = vertical ? plotArea.namedYAxes : plotArea.namedXAxes,
                tracker = vertical ? plotArea.yAxisRangeTracker : plotArea.xAxisRangeTracker,
                axisOptions = deepExtend({}, options, { vertical: vertical }),
                isLog = equalsIgnoreCase(axisOptions.type, LOGARITHMIC),
                defaultRange = tracker.query(),
                defaultAxisRange = isLog ? {min: 0.1, max: 1} : { min: 0, max: 1 },
                range = tracker.query(axisName) || defaultRange || defaultAxisRange,
                axis,
                axisType,
                seriesIx,
                series = plotArea.series,
                currentSeries,
                seriesAxisName,
                firstPointValue,
                typeSamples = [axisOptions.min, axisOptions.max],
                inferredDate,
                i;

            for (seriesIx = 0; seriesIx < series.length; seriesIx++) {
                currentSeries = series[seriesIx];
                seriesAxisName = currentSeries[vertical ? "yAxis" : "xAxis"];
                if ((seriesAxisName == axisOptions.name) || (axisIndex === 0 && !seriesAxisName)) {
                    firstPointValue = SeriesBinder.current.bindPoint(currentSeries, 0).valueFields;
                    typeSamples.push(firstPointValue[vertical ? "y" : "x"]);

                    break;
                }
            }

            if (axisIndex === 0 && defaultRange) {
                range.min = math.min(range.min, defaultRange.min);
                range.max = math.max(range.max, defaultRange.max);
            }

            for (i = 0; i < typeSamples.length; i++) {
                if (typeSamples[i] instanceof Date) {
                    inferredDate = true;
                    break;
                }
            }

            if (equalsIgnoreCase(axisOptions.type, DATE) || (!axisOptions.type && inferredDate)) {
                axisType = DateValueAxis;
            } else if (isLog){
                axisType = LogarithmicAxis;
            } else {
                axisType = NumericAxis;
            }

            axis = new axisType(range.min, range.max, axisOptions);

            if (axisName) {
                if (namedAxes[axisName]) {
                    throw new Error(
                        (vertical ? "Y" : "X") +
                        " axis with name " + axisName + " is already defined"
                    );
                }
                namedAxes[axisName] = axis;
            }

            plotArea.appendAxis(axis);

            return axis;
        },

        createAxes: function(panes) {
            var plotArea = this,
                options = plotArea.options,
                axisPane,
                xAxesOptions = [].concat(options.xAxis),
                xAxes = [],
                yAxesOptions = [].concat(options.yAxis),
                yAxes = [];

            each(xAxesOptions, function(i) {
                axisPane = plotArea.findPane(this.pane);
                if (inArray(axisPane, panes)) {
                    xAxes.push(plotArea.createXYAxis(this, false, i));
                }
            });

            each(yAxesOptions, function(i) {
                axisPane = plotArea.findPane(this.pane);
                if (inArray(axisPane, panes)) {
                    yAxes.push(plotArea.createXYAxis(this, true, i));
                }
            });

            plotArea.axisX = plotArea.axisX || xAxes[0];
            plotArea.axisY = plotArea.axisY || yAxes[0];
        },

        click: function(chart, e) {
            var plotArea = this,
                coords = chart._eventCoordinates(e),
                point = new Point2D(coords.x, coords.y),
                allAxes = plotArea.axes,
                i,
                length = allAxes.length,
                axis,
                xValues = [],
                yValues = [],
                currentValue,
                values;

            for (i = 0; i < length; i++) {
                axis = allAxes[i];
                values = axis.options.vertical ? yValues : xValues;
                currentValue = axis.getValue(point);
                if (currentValue !== null) {
                    values.push(currentValue);
                }
            }

            if (xValues.length > 0 && yValues.length > 0) {
                chart.trigger(PLOT_AREA_CLICK, {
                    element: $(e.target),
                    x: singleItemOrArray(xValues),
                    y: singleItemOrArray(yValues)
                });
            }
        }
    });

    var PiePlotArea = PlotAreaBase.extend({
        render: function() {
            var plotArea = this,
                series = plotArea.series;

            plotArea.createPieChart(series);
        },

        createPieChart: function(series) {
            var plotArea = this,
                firstSeries = series[0],
                pieChart = new PieChart(plotArea, {
                    series: series,
                    padding: firstSeries.padding,
                    startAngle: firstSeries.startAngle,
                    connectors: firstSeries.connectors,
                    legend: plotArea.options.legend
                });

            plotArea.appendChart(pieChart);
        },

        appendChart: function(chart, pane) {
            PlotAreaBase.fn.appendChart.call(this, chart, pane);
            append(this.options.legend.items, chart.legendItems);
        }
    });

    var DonutPlotArea = PiePlotArea.extend({
        render: function() {
            var plotArea = this,
                series = plotArea.series;

            plotArea.createDonutChart(series);
        },

        createDonutChart: function(series) {
            var plotArea = this,
                firstSeries = series[0],
                donutChart = new DonutChart(plotArea, {
                    series: series,
                    padding: firstSeries.padding,
                    connectors: firstSeries.connectors,
                    legend: plotArea.options.legend
                });

            plotArea.appendChart(donutChart);
        }
    });

    var PieAnimation = ElementAnimation.extend({
        options: {
            easing: "easeOutElastic",
            duration: INITIAL_ANIMATION_DURATION
        },

        setup: function() {
            var element = this.element,
                sector = element.config,
                startRadius;

            if (element.options.singleSegment) {
                sector = element;
            }

            this.endRadius = sector.r;
            startRadius = this.startRadius = sector.ir || 0;
            sector.r = startRadius;
        },

        step: function(pos) {
            var animation = this,
                element = animation.element,
                endRadius = animation.endRadius,
                sector = element.config,
                startRadius = animation.startRadius;

            if (element.options.singleSegment) {
                sector = element;
            }

            sector.r = interpolateValue(startRadius, endRadius, pos);
        }
    });

    var BubbleAnimation = ElementAnimation.extend({
        options: {
            easing: "easeOutElastic",
            duration: INITIAL_ANIMATION_DURATION
        },

        setup: function() {
            var circle = this.element;

            circle.endRadius = circle.radius;
            circle.radius = 0;
        },

        step: function(pos) {
            var circle = this.element,
                endRadius = circle.endRadius;

            circle.radius = interpolateValue(0, endRadius, pos);
        }
    });

    var BarAnimationDecorator = animationDecorator(BAR, BarAnimation),
        PieAnimationDecorator = animationDecorator(PIE, PieAnimation),
        BubbleAnimationDecorator = animationDecorator(BUBBLE, BubbleAnimation);

    var Highlight = Class.extend({
        init: function(view) {
            var highlight = this;

            highlight.view = view;
            highlight._overlays = [];
        },

        options: {
            fill: WHITE,
            fillOpacity: 0.2,
            stroke: WHITE,
            strokeWidth: 1,
            strokeOpacity: 0.2
        },

        show: function(points) {
            var highlight = this,
                view = highlight.view,
                container,
                overlay,
                overlays = highlight._overlays,
                overlayElement, i, point,
                pointOptions;

            highlight.hide();
            highlight._points = points = [].concat(points);

            for (i = 0; i < points.length; i++) {
                point = points[i];
                if (point) {
                    pointOptions = point.options;

                    if (!pointOptions || (pointOptions.highlight || {}).visible) {
                        if (point.highlightOverlay && point.visible !== false) {
                            overlay = point.highlightOverlay(view, highlight.options);

                            if (overlay) {
                                overlayElement = view.renderElement(overlay);
                                overlays.push(overlayElement);

                                if (point.owner && point.owner.pane) {
                                    container = getElement(point.owner.pane.chartContainer.id);
                                    container.appendChild(overlayElement);
                                }
                            }
                        }

                        if (point.toggleHighlight) {
                            point.toggleHighlight(view);
                        }
                    }
                }
            }
        },

        hide: function() {
            var highlight = this,
                points = highlight._points,
                overlays = highlight._overlays,
                overlay, i, point, pointOptions;

            while (overlays.length) {
                overlay = highlight._overlays.pop();
                overlay.parentNode.removeChild(overlay);
            }

            if (points) {
                for (i = 0; i < points.length; i++) {
                    point = points[i];
                    if (point) {
                        pointOptions = point.options;

                        if (!pointOptions || (pointOptions.highlight || {}).visible) {
                            if (point.toggleHighlight) {
                                point.toggleHighlight(highlight.view);
                            }
                        }
                    }
                }
            }

            highlight._points = [];
        }
    });

    var BaseTooltip = Class.extend({
        init: function(chartElement, options) {
            var tooltip = this;

            tooltip.options = deepExtend({}, tooltip.options, options);

            tooltip.chartElement = chartElement;

            tooltip.template = BaseTooltip.template;
            if (!tooltip.template) {
                tooltip.template = BaseTooltip.template = renderTemplate(
                    "<div class='" + CSS_PREFIX + "tooltip' " +
                    "style='display:none; position: absolute; font: #= d.font #;" +
                    "border: #= d.border.width #px solid;" +
                    "opacity: #= d.opacity #; filter: alpha(opacity=#= d.opacity * 100 #);'>" +
                    "</div>"
                );
            }

            tooltip.element = $(tooltip.template(tooltip.options)).appendTo(chartElement);
            tooltip._moveProxy = proxy(tooltip.move, tooltip);
        },

        options: {
            border: {
                width: 1
            },
            opacity: 1,
            animation: {
                duration: TOOLTIP_ANIMATION_DURATION
            }
        },

        move: function() {
            var tooltip = this,
                options = tooltip.options,
                element = tooltip.element,
                offset;

            if (!tooltip.anchor) {
                return;
            }

            offset = tooltip._offset();

            if (!tooltip.visible) {
                element.css({ top: offset.top, left: offset.left });
            }

            element
                .stop(true, true)
                .show()
                .animate({
                    left: offset.left,
                    top: offset.top
                }, options.animation.duration);

            tooltip.visible = true;
        },

        _padding: function() {
            if (!this._chartPadding) {
                var chartElement = this.chartElement;
                this._chartPadding = {
                    top: parseInt(chartElement.css("paddingTop"), 10),
                    left: parseInt(chartElement.css("paddingLeft"), 10)
                };
            }

            return this._chartPadding;
        },

        _offset: function() {
            var tooltip = this,
                element = tooltip.element,
                anchor = tooltip.anchor,
                chartPadding = tooltip._padding(),
                top = round(anchor.y + chartPadding.top),
                left = round(anchor.x + chartPadding.left),
                zoomLevel = kendo.support.zoomLevel(),
                viewport = $(window),
                offsetTop = window.pageYOffset || document.documentElement.scrollTop || 0,
                offsetLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;

            offsetTop = tooltip.chartElement.offset().top - offsetTop;
            offsetLeft = tooltip.chartElement.offset().left - offsetLeft;

            top += tooltip._currentPosition(top + offsetTop, element.outerHeight(), viewport.outerHeight() / zoomLevel);
            left += tooltip._currentPosition(left + offsetLeft, element.outerWidth(), viewport.outerWidth() / zoomLevel);

            return {
                top: top,
                left: left
            };
        },

        setStyle: function(options) {
            this.element
                    .css({
                        backgroundColor: options.background,
                        borderColor: options.border.color || options.background,
                        font: options.font,
                        color: options.color,
                        opacity: options.opacity,
                        borderWidth: options.border.width
                    });
        },

        show: function() {
            var tooltip = this;

            tooltip.showTimeout = setTimeout(tooltip._moveProxy, TOOLTIP_SHOW_DELAY);
        },

        hide: function() {
            var tooltip = this;

            clearTimeout(tooltip.showTimeout);

            if (tooltip.visible) {
                tooltip._hideElement();

                tooltip.point = null;
                tooltip.visible = false;
                tooltip.index = null;
            }
        },

        _hideElement: function() {
            this.element.fadeOut();
        },

        _pointContent: function(point) {
            var tooltip = this,
                options = deepExtend({}, tooltip.options, point.options.tooltip),
                content, tooltipTemplate;

            if (defined(point.value)) {
                content = point.value.toString();
            }

            if (options.template) {
                tooltipTemplate = template(options.template);
                content = tooltipTemplate({
                    value: point.value,
                    category: point.category,
                    series: point.series,
                    dataItem: point.dataItem,
                    percentage: point.percentage,
                    low: point.low,
                    high: point.high,
                    xLow: point.xLow,
                    xHigh: point.xHigh,
                    yLow: point.yLow,
                    yHigh: point.yHigh
                });
            } else if (options.format) {
                content = point.formatValue(options.format);
            }

            return content;
        },

        _pointAnchor: function(point) {
            var tooltip = this,
                element = tooltip.element;

            return point.tooltipAnchor(element.outerWidth(), element.outerHeight());
        },

        _currentPosition: function(offset, size, viewPortSize) {
            var output = 0;

            if (offset + size > viewPortSize) {
                output = viewPortSize - (offset + size);
            }

            if (offset < 0) {
                output = -offset;
            }

            return output;
        },

        _updateStyle: function(options, point) {
            if (!defined(options.background)) {
                options.background = point.color || point.options.color;
            }

            if (!defined(options.color)) {
                var tooltip = this,
                    element = tooltip.element,
                    brightnessValue = new Color(options.background).percBrightness();

                if (brightnessValue > 180) {
                    element.addClass(CSS_PREFIX + TOOLTIP_INVERSE);
                } else {
                    element.removeClass(CSS_PREFIX + TOOLTIP_INVERSE);
                }
            }
        }
    });

    var Tooltip = BaseTooltip.extend({
        show: function(point) {
            var tooltip = this,
                options = deepExtend({}, tooltip.options, point.options.tooltip);

            if (!point) {
                return;
            }

            tooltip.element.html(tooltip._pointContent(point));
            tooltip.anchor = tooltip._pointAnchor(point);

            if (tooltip.anchor) {
                tooltip._updateStyle(options, point);
                tooltip.setStyle(options);

                BaseTooltip.fn.show.call(tooltip, point);
            } else {
                tooltip.hide();
            }
        }
    });

    var SharedTooltip = BaseTooltip.extend({
        init: function(element, plotArea, options) {
            var tooltip = this;

            BaseTooltip.fn.init.call(tooltip, element, options);

            tooltip.plotArea = plotArea;
        },

        options: {
            sharedTemplate:
                "<table>" +
                "<th colspan='2'>#= categoryText #</th>" +
                "# for(var i = 0; i < points.length; i++) { #" +
                "# var point = points[i]; #" +
                "<tr>" +
                    "# if(point.series.name) { # " +
                        "<td> #= point.series.name #:</td>" +
                    "# } #" +
                    "<td>#= content(point) #</td>" +
                "</tr>" +
                "# } #" +
                "</table>",
            categoryFormat: "{0:d}"
        },

        showAt: function(points, coords) {
            var tooltip = this,
                options = tooltip.options,
                plotArea = tooltip.plotArea,
                axis = plotArea.categoryAxis,
                index = axis.pointCategoryIndex(coords),
                category = axis.getCategory(coords),
                slot = axis.getSlot(index),
                content;

            points = $.grep(points, function(p) {
                var tooltip = p.series.tooltip,
                    excluded = tooltip && tooltip.visible === false;

                return !excluded;
            });

            if (points.length > 0) {
                content = tooltip._content(points, category);
                tooltip.element.html(content);
                tooltip.anchor = tooltip._slotAnchor(coords, slot);
                tooltip._updateStyle(options, points[0]);
                tooltip.setStyle(options);

                BaseTooltip.fn.show.call(tooltip);
            }
        },

        _slotAnchor: function(point, slot) {
            var tooltip = this,
                plotArea = tooltip.plotArea,
                axis = plotArea.categoryAxis,
                anchor,
                hCenter = point.y - tooltip.element.height() / 2;

            if (axis.options.vertical) {
                anchor = Point2D(point.x, hCenter);
            } else {
                anchor = Point2D(slot.center().x, hCenter);
            }

            return anchor;
        },

        _content: function(points, category) {
            var tooltip = this,
                template,
                content;

            template = kendo.template(tooltip.options.sharedTemplate);
            content = template({
                points: points,
                category: category,
                categoryText: autoFormat(tooltip.options.categoryFormat, category),
                content: tooltip._pointContent
            });

            return content;
        }
    });

    var Crosshair = ChartElement.extend({
        init: function(axis, options) {
            var crosshair = this;

            ChartElement.fn.init.call(crosshair, options);
            crosshair.axis = axis;

            if (!crosshair.id) {
                crosshair.id = uniqueId();
            }
            crosshair._visible = false;
            crosshair.stickyMode = axis instanceof CategoryAxis;
            crosshair.enableDiscovery();
        },

        options: {
            color: BLACK,
            width: 1,
            zIndex: -1,
            tooltip: {
                visible: false
            }
        },

        repaint: function() {
            var crosshair = this,
                element = crosshair.element;

            crosshair.getViewElements(crosshair._view);
            element = crosshair.element;
            element.refresh(getElement(crosshair.id));
        },

        showAt: function(point) {
            var crosshair = this;

            crosshair._visible = true;
            crosshair.point = point;
            crosshair.repaint();

            if (crosshair.options.tooltip.visible) {
                if (!crosshair.tooltip) {
                    crosshair.tooltip = new CrosshairTooltip(
                        crosshair,
                        deepExtend({}, crosshair.options.tooltip, { stickyMode: crosshair.stickyMode })
                    );
                }
                crosshair.tooltip.showAt(point);
            }
        },

        hide: function() {
            var crosshair = this;

            if (crosshair._visible) {
                crosshair._visible = false;
                crosshair.repaint();
                if (crosshair.tooltip) {
                    crosshair.tooltip.hide();
                }
            }
        },

        linePoints: function() {
            var crosshair = this,
                axis = crosshair.axis,
                vertical = axis.options.vertical,
                box = crosshair.getBox(),
                point = crosshair.point,
                dim = vertical ? Y : X,
                slot, lineStart, lineEnd;

            lineStart = Point2D(box.x1, box.y1);
            if (vertical) {
                lineEnd = Point2D(box.x2, box.y1);
            } else {
                lineEnd = Point2D(box.x1, box.y2);
            }

            if (point) {
                if (crosshair.stickyMode) {
                    slot = axis.getSlot(axis.pointCategoryIndex(point));
                    lineStart[dim] = lineEnd[dim] = slot.center()[dim];
                } else {
                    lineStart[dim] = lineEnd[dim] = point[dim];
                }
            }

            crosshair.box = box;

            return [lineStart, lineEnd];
        },

        getBox: function() {
            var crosshair = this,
                axis = crosshair.axis,
                axes = axis.pane.axes,
                length = axes.length,
                vertical = axis.options.vertical,
                box = axis.lineBox().clone(),
                dim = vertical ? X : Y,
                axisLineBox, currentAxis, i;

            for (i = 0; i < length; i++) {
                currentAxis = axes[i];
                if (currentAxis.options.vertical != vertical) {
                    if (!axisLineBox) {
                        axisLineBox = currentAxis.lineBox().clone();
                    } else {
                        axisLineBox.wrap(currentAxis.lineBox());
                    }
                }
            }

            box[dim + 1] = axisLineBox[dim + 1];
            box[dim + 2] = axisLineBox[dim + 2];

            return box;
        },

        getViewElements: function(view) {
            var crosshair = this,
                options = crosshair.options,
                elements = [];

            crosshair.points = crosshair.linePoints();
            crosshair.element = view.createPolyline(crosshair.points, false, {
                data: { modelId: crosshair.modelId },
                id: crosshair.id,
                stroke: options.color,
                strokeWidth: options.width,
                strokeOpacity: options.opacity,
                dashType: options.dashType,
                zIndex: options.zIndex,
                visible: crosshair._visible
            });

            elements.push(crosshair.element);
            crosshair._view = view;

            append(elements, ChartElement.fn.getViewElements.call(crosshair, view));

            return elements;
        },

        destroy: function() {
            var crosshair = this;
            if (crosshair.tooltip) {
                crosshair.tooltip.destroy();
            }

            ChartElement.fn.destroy.call(crosshair);
        }
    });

    var CrosshairTooltip = BaseTooltip.extend({
        init: function(crosshair, options) {
            var tooltip = this,
                chartElement = crosshair.axis.getRoot().parent.element;

            tooltip.crosshair = crosshair;

            BaseTooltip.fn.init.call(tooltip, chartElement, deepExtend({},
                tooltip.options, {
                    background: crosshair.axis.plotArea.options.seriesColors[0]
                },
                options));

            tooltip._updateStyle(tooltip.options, {});
            tooltip.setStyle(tooltip.options);
        },

        options: {
            padding: 10
        },

        showAt: function(point) {
            var tooltip = this,
                element = tooltip.element;

            tooltip.point = point;
            tooltip.element.html(tooltip.content(point));
            tooltip.anchor = tooltip.getAnchor(element.outerWidth(), element.outerHeight());

            tooltip.move();
        },

        move: function() {
            var tooltip = this,
                element = tooltip.element,
                offset = tooltip._offset();

            element.css({ top: offset.top, left: offset.left }).show();
        },

        content: function(point) {
            var tooltip = this,
                options = tooltip.options,
                axis = tooltip.crosshair.axis,
                axisOptions = axis.options,
                content, value, tooltipTemplate;

            value = content = axis[options.stickyMode ? "getCategory" : "getValue"](point);

            if (options.template) {
                tooltipTemplate = template(options.template);
                content = tooltipTemplate({
                    value: value
                });
            } else if (options.format) {
                content = autoFormat(options.format, value);
            } else {
                if (axisOptions.type === DATE) {
                    content = autoFormat(axisOptions.labels.dateFormats[axisOptions.baseUnit], value);
                }
            }

            return content;
        },

        getAnchor: function(width, height) {
            var tooltip = this,
                options = tooltip.options,
                position = options.position,
                vertical = tooltip.crosshair.axis.options.vertical,
                points = tooltip.crosshair.points,
                fPoint = points[0],
                sPoint = points[1],
                halfWidth = width / 2,
                halfHeight = height / 2,
                padding = options.padding,
                x, y;

            if (vertical) {
                if (position === LEFT) {
                    x = fPoint.x - width - padding;
                    y = fPoint.y - halfHeight;
                } else {
                    x = sPoint.x + padding;
                    y = sPoint.y - halfHeight;
                }
            } else {
                if (position === BOTTOM) {
                    x = sPoint.x - halfWidth;
                    y = sPoint.y + padding;
                } else {
                    x = fPoint.x - halfWidth;
                    y = fPoint.y - height - padding;
                }
            }

            return Point2D(x, y);
        },

        hide: function() {
            this.element.hide();
            this.point = null;
        },

        destroy: function() {
            this.element.remove();
            this.element = null;
            this.point = null;
        }
    });

    var Aggregates = {
        min: function(values) {
            var min = MAX_VALUE,
                i,
                length = values.length,
                n;

            for (i = 0; i < length; i++) {
                n = values[i];
                if (isNumber(n)) {
                    min = math.min(min, n);
                }
            }

            return min === MAX_VALUE ? values[0] : min;
        },

        max: function(values) {
            var max = MIN_VALUE,
                i,
                length = values.length,
                n;

            for (i = 0; i < length; i++) {
                n = values[i];
                if (isNumber(n)) {
                    max = math.max(max, n);
                }
            }

            return max === MIN_VALUE ? values[0] : max;
        },

        sum: function(values) {
            var length = values.length,
                sum = 0,
                i,
                n;

            for (i = 0; i < length; i++) {
                n = values[i];
                if (isNumber(n)) {
                    sum += n;
                }
            }

            return sum;
        },

        count: function(values) {
            var length = values.length,
                count = 0,
                i,
                val;

            for (i = 0; i < length; i++) {
                val = values[i];
                if (val !== null && defined(val)) {
                    count++;
                }
            }

            return count;
        },

        avg: function(values) {
            var result = values[0],
                count = countNumbers(values);

            if (count > 0) {
                result = Aggregates.sum(values) / count;
            }

            return result;
        },

        first: function(values) {
            var length = values.length,
                i,
                val;

            for (i = 0; i < length; i++) {
                val = values[i];
                if (val !== null && defined(val)) {
                    return val;
                }
            }

            return values[0];
        }
    };

    function DefaultAggregates() {
        this._defaults = {};
    }

    DefaultAggregates.prototype = {
        register: function(seriesTypes, aggregates) {
            for (var i = 0; i < seriesTypes.length; i++) {
                this._defaults[seriesTypes[i]] = aggregates;
            }
        },

        query: function(seriesType) {
            return this._defaults[seriesType];
        }
    };

    DefaultAggregates.current = new DefaultAggregates();

    var Selection = Observable.extend({
        init: function(chart, categoryAxis, options) {
            var that = this,
                chartElement = chart.element,
                categoryAxisLineBox = categoryAxis.lineBox(),
                valueAxis = that.getValueAxis(categoryAxis),
                valueAxisLineBox = valueAxis.lineBox(),
                selectorPrefix = "." + CSS_PREFIX,
                wrapper, padding;

            Observable.fn.init.call(that);

            that.options = deepExtend({}, that.options, options);
            options = that.options;
            that.chart = chart;
            that.chartElement = chartElement;
            that.categoryAxis = categoryAxis;
            that._dateAxis = that.categoryAxis instanceof DateCategoryAxis;
            that.valueAxis = valueAxis;

            if (that._dateAxis) {
                deepExtend(options, {
                    min: toDate(options.min),
                    max: toDate(options.max),
                    from: toDate(options.from),
                    to: toDate(options.to)
                });
            }

            that.template = Selection.template;
            if (!that.template) {
                that.template = Selection.template = renderTemplate(
                    "<div class='" + CSS_PREFIX + "selector' " +
                    "style='width: #= d.width #px; height: #= d.height #px;" +
                    " top: #= d.offset.top #px; left: #= d.offset.left #px;'>" +
                    "<div class='" + CSS_PREFIX + "mask'></div>" +
                    "<div class='" + CSS_PREFIX + "mask'></div>" +
                    "<div class='" + CSS_PREFIX + "selection'>" +
                    "<div class='" + CSS_PREFIX + "selection-bg'></div>" +
                    "<div class='" + CSS_PREFIX + "handle " + CSS_PREFIX + "leftHandle'><div></div></div>" +
                    "<div class='" + CSS_PREFIX + "handle " + CSS_PREFIX + "rightHandle'><div></div></div>" +
                    "</div></div>"
                );
            }

            padding = {
                left: parseInt(chartElement.css("paddingLeft"), 10),
                right: parseInt(chartElement.css("paddingTop"), 10)
            };

            that.options = deepExtend({}, {
                width: categoryAxisLineBox.width(),
                height: valueAxisLineBox.height(),
                padding: padding,
                offset: {
                    left: valueAxisLineBox.x2 + padding.left,
                    top: valueAxisLineBox.y1 + padding.right
                },
                from: options.min,
                to: options.max
            }, options);

            if (that.options.visible) {
                that.wrapper = wrapper = $(that.template(that.options)).appendTo(chartElement);

                that.selection = wrapper.find(selectorPrefix + "selection");
                that.leftMask = wrapper.find(selectorPrefix + "mask").first();
                that.rightMask = wrapper.find(selectorPrefix + "mask").last();
                that.leftHandle = wrapper.find(selectorPrefix + "leftHandle");
                that.rightHandle = wrapper.find(selectorPrefix + "rightHandle");
                that.options.selection = {
                    border: {
                        left: parseFloat(that.selection.css("border-left-width"), 10),
                        right: parseFloat(that.selection.css("border-right-width"), 10)
                    }
                };

                that.leftHandle.css("top", (that.selection.height() - that.leftHandle.height()) / 2);
                that.rightHandle.css("top", (that.selection.height() - that.rightHandle.height()) / 2);

                that.set(that._index(options.from), that._index(options.to));

                that.bind(that.events, that.options);
                that.wrapper[0].style.cssText = that.wrapper[0].style.cssText;

                that.wrapper.on(MOUSEWHEEL_NS, proxy(that._mousewheel, that));

                if (kendo.UserEvents) {
                    that.userEvents = new kendo.UserEvents(that.wrapper, {
                        global: true,
                        stopPropagation: true,
                        multiTouch: true,
                        start: proxy(that._start, that),
                        move: proxy(that._move, that),
                        end: proxy(that._end, that),
                        tap: proxy(that._tap, that),
                        gesturestart: proxy(that._gesturechange, that),
                        gesturechange: proxy(that._gesturechange, that)
                    });
                } else {
                    that.leftHandle.add(that.rightHandle).removeClass(CSS_PREFIX + "handle");
                }
            }
        },

        events: [
            SELECT_START,
            SELECT,
            SELECT_END
        ],

        options: {
            visible: true,
            mousewheel: {
                zoom: BOTH
            },
            min: MIN_VALUE,
            max: MAX_VALUE
        },

        destroy: function() {
            var that = this,
                userEvents = that.userEvents;

            if (userEvents) {
                userEvents.destroy();
            }
        },

        _rangeEventArgs: function(range) {
            var that = this;

            return {
                axis: that.categoryAxis.options,
                from: that._value(range.from),
                to: that._value(range.to)
            };
        },

        _start: function(e) {
            var that = this,
                options = that.options,
                target = $(e.event.target),
                args;

            if (that._state || !target) {
                return;
            }

            that.chart._unsetActivePoint();
            that._state = {
                moveTarget: target.parents(".k-handle").add(target).first(),
                startLocation: e.x ? e.x.location : 0,
                range: {
                    from: that._index(options.from),
                    to: that._index(options.to)
                }
            };

            args = that._rangeEventArgs({
                from: that._index(options.from),
                to: that._index(options.to)
            });

            if (that.trigger(SELECT_START, args)) {
                that.userEvents.cancel();
                that._state = null;
            }
        },

        _move: function(e) {
            if (!this._state) {
                return;
            }

            var that = this,
                state = that._state,
                options = that.options,
                categories = that.categoryAxis.options.categories,
                from = that._index(options.from),
                to = that._index(options.to),
                min = that._index(options.min),
                max = that._index(options.max),
                delta = state.startLocation - e.x.location,
                range = state.range,
                oldRange = { from: range.from, to: range.to },
                span = range.to - range.from,
                target = state.moveTarget,
                scale = that.wrapper.width() / (categories.length - 1),
                offset = math.round(delta / scale);

            if (!target) {
                return;
            }

            e.preventDefault();

            if (target.is(".k-selection, .k-selection-bg")) {
                range.from = math.min(
                    math.max(min, from - offset),
                    max - span
                );
                range.to = math.min(
                    range.from + span,
                    max
                );
            } else if (target.is(".k-leftHandle")) {
                range.from = math.min(
                    math.max(min, from - offset),
                    max - 1
                );
                range.to = math.max(range.from + 1, range.to);
            } else if (target.is(".k-rightHandle")) {
                range.to = math.min(
                    math.max(min + 1, to - offset),
                    max
                );
                range.from = math.min(range.to - 1, range.from);
            }

            if (range.from !== oldRange.from || range.to !== oldRange.to) {
                that.move(range.from, range.to);
                that.trigger(SELECT, that._rangeEventArgs(range));
            }
        },

        _end: function() {
            var that = this,
                range = that._state.range;

            delete that._state;
            that.set(range.from, range.to);
            that.trigger(SELECT_END, that._rangeEventArgs(range));
        },

        _gesturechange: function(e) {
            if (!this._state) {
                return;
            }

            var that = this,
                chart = that.chart,
                state = that._state,
                options = that.options,
                categoryAxis = that.categoryAxis,
                range = state.range,
                p0 = chart._toModelCoordinates(e.touches[0].x.location).x,
                p1 = chart._toModelCoordinates(e.touches[1].x.location).x,
                left = math.min(p0, p1),
                right = math.max(p0, p1);

            e.preventDefault();
            state.moveTarget = null;

            range.from =
                categoryAxis.pointCategoryIndex(new dataviz.Point2D(left)) ||
                options.min;

            range.to =
                categoryAxis.pointCategoryIndex(new dataviz.Point2D(right)) ||
                options.max;

            that.move(range.from, range.to);
        },

        _tap: function(e) {
            var that = this,
                options = that.options,
                coords = that.chart._eventCoordinates(e),
                categoryAxis = that.categoryAxis,
                categoryIx = categoryAxis.pointCategoryIndex(
                    new dataviz.Point2D(coords.x, categoryAxis.box.y1)
                ),
                from = that._index(options.from),
                to = that._index(options.to),
                min = that._index(options.min),
                max = that._index(options.max),
                span = to - from,
                mid = from + span / 2,
                offset = math.round(mid - categoryIx),
                range = {},
                rightClick = e.event.which === 3;

            if (that._state || rightClick) {
                return;
            }

            e.preventDefault();
            that.chart._unsetActivePoint();

            if (!categoryAxis.options.justified) {
                offset--;
            }

            range.from = math.min(
                math.max(min, from - offset),
                max - span
            );

            range.to = math.min(range.from + span, max);

            that._start(e);
            if (that._state) {
                that._state.range = range;
                that.trigger(SELECT, that._rangeEventArgs(range));
                that._end();
            }
        },

        _mousewheel: function(e) {
            var that = this,
                options = that.options,
                delta = mwDelta(e);

            that._start({ event: { target: that.selection } });

            if (that._state) {
                var range = that._state.range;

                e.preventDefault();
                e.stopPropagation();

                if (math.abs(delta) > 1) {
                    delta *= ZOOM_ACCELERATION;
                }

                if (options.mousewheel.reverse) {
                    delta *= -1;
                }

                if (that.expand(delta)) {
                    that.trigger(SELECT, {
                        axis: that.categoryAxis.options,
                        delta: delta,
                        originalEvent: e,
                        from: that._value(range.from),
                        to: that._value(range.to)
                    });
                }

                if (that._mwTimeout) {
                    clearTimeout(that._mwTimeout);
                }

                that._mwTimeout = setTimeout(function() {
                    that._end();
                }, MOUSEWHEEL_DELAY);
            }
        },

        _index: function(value) {
            var that = this,
                categoryAxis = that.categoryAxis,
                categories = categoryAxis.options.categories,
                index = value;

            if (value instanceof Date) {
                index = lteDateIndex(value, categories);
                if (!categoryAxis.options.justified && value > last(categories)) {
                    index += 1;
                }
            }

            return index;
        },

        _value: function(index) {
            var that = this,
                categoryAxis = this.categoryAxis,
                categories = categoryAxis.options.categories,
                value = index;

            if (that._dateAxis) {
                if (index > categories.length - 1) {
                    value = that.options.max;
                } else {
                    value = categories[index];
                }
            }

            return value;
        },

        _slot: function(value) {
            var that = this,
                categoryAxis = this.categoryAxis;

            return categoryAxis.getSlot(that._index(value));
        },

        move: function(from, to) {
            var that = this,
                options = that.options,
                offset = options.offset,
                padding = options.padding,
                border = options.selection.border,
                leftMaskWidth,
                rightMaskWidth,
                box,
                distance;

            box = that._slot(from);
            leftMaskWidth = round(box.x1 - offset.left + padding.left);
            that.leftMask.width(leftMaskWidth);
            that.selection.css("left", leftMaskWidth);

            box = that._slot(to);
            rightMaskWidth = round(options.width - (box.x1 - offset.left + padding.left));
            that.rightMask.width(rightMaskWidth);
            distance = options.width - rightMaskWidth;
            if (distance != options.width) {
                distance += border.right;
            }

            that.rightMask.css("left", distance);
            that.selection.width(math.max(
                options.width - (leftMaskWidth + rightMaskWidth) - border.right,
                0
            ));
        },

        set: function(from, to) {
            var that = this,
                options = that.options,
                min = that._index(options.min),
                max = that._index(options.max);

            from = limitValue(that._index(from), min, max);
            to = limitValue(that._index(to), from + 1, max);

            if (options.visible) {
                that.move(from, to);
            }

            options.from = that._value(from);
            options.to = that._value(to);
        },

        expand: function(delta) {
            var that = this,
                options = that.options,
                min = that._index(options.min),
                max = that._index(options.max),
                zDir = options.mousewheel.zoom,
                from = that._index(options.from),
                to = that._index(options.to),
                range = { from: from, to: to },
                oldRange = deepExtend({}, range);

            if (that._state) {
                range = that._state.range;
            }

            if (zDir !== RIGHT) {
                range.from = limitValue(
                    limitValue(from - delta, 0, to - 1),
                    min, max
                );
            }

            if (zDir !== LEFT) {
                range.to = limitValue(
                    limitValue(to + delta, range.from + 1, max),
                    min,
                    max
                 );
            }

            if (range.from !== oldRange.from || range.to !== oldRange.to) {
                that.set(range.from, range.to);
                return true;
            }
        },

        getValueAxis: function(categoryAxis) {
            var axes = categoryAxis.pane.axes,
                axesCount = axes.length,
                i, axis;

            for (i = 0; i < axesCount; i++) {
                axis = axes[i];

                if (axis.options.vertical !== categoryAxis.options.vertical) {
                    return axis;
                }
            }
        }
    });

    var SeriesAggregator = function(series, binder, defaultAggregates) {
        var sa = this,
            canonicalFields = binder.canonicalFields(series),
            valueFields = binder.valueFields(series),
            sourceFields = binder.sourceFields(series, canonicalFields),
            seriesFields = sa._seriesFields = [],
            defaults = defaultAggregates.query(series.type),
            rootAggregate = series.aggregate || defaults,
            i;

        sa._series = series;
        sa._binder = binder;

        for (i = 0; i < canonicalFields.length; i++) {
            var field = canonicalFields[i],
                fieldAggregate;

            if (typeof rootAggregate === OBJECT) {
                fieldAggregate = rootAggregate[field];
            } else if (i === 0 || inArray(field, valueFields)) {
                fieldAggregate = rootAggregate;
            } else {
                break;
            }

            if (fieldAggregate) {
                seriesFields.push({
                    canonicalName: field,
                    name: sourceFields[i],
                    transform: isFn(fieldAggregate) ?
                        fieldAggregate : Aggregates[fieldAggregate]
                });
            }
        }
    };

    SeriesAggregator.prototype = {
        aggregatePoints: function(srcPoints, group) {
            var sa = this,
                data = sa._bindPoints(srcPoints || []),
                series = sa._series,
                seriesFields = sa._seriesFields,
                i,
                field,
                srcValues,
                value,
                firstDataItem = data.dataItems[0],
                result = {};

            if (firstDataItem && !isNumber(firstDataItem) && !isArray(firstDataItem)) {
                var fn = function() {};
                fn.prototype = firstDataItem;
                result = new fn();
            }

            for (i = 0; i < seriesFields.length; i++) {
                field = seriesFields[i];
                srcValues = sa._bindField(data.values, field.canonicalName);
                value = field.transform(srcValues, series, data.dataItems, group);

                if (value !== null && typeof value === OBJECT && !defined(value.length)) {
                    result = value;
                    break;
                } else {
                    if (defined(value)) {
                        ensureTree(field.name, result);
                        kendo.setter(field.name)(result, value);
                    }
                }
            }

            return result;
        },

        _bindPoints: function(points) {
            var sa = this,
                binder = sa._binder,
                series = sa._series,
                values = [],
                dataItems = [],
                i,
                pointIx;

            for (i = 0; i < points.length; i++) {
                pointIx = points[i];

                values.push(binder.bindPoint(series, pointIx));
                dataItems.push(series.data[pointIx]);
            }

            return {
                values: values,
                dataItems: dataItems
            };
        },

        _bindField: function(data, field) {
            var values = [],
                count = data.length,
                i, item, value, valueFields;

            for (i = 0; i < count; i++) {
                item = data[i];
                valueFields = item.valueFields;

                if (defined(valueFields[field])) {
                    value = valueFields[field];
                } else {
                    value = item.fields[field];
                }

                values.push(value);
            }

            return values;
        }
    };

    function sparseArrayMin(arr) {
        return sparseArrayLimits(arr).min;
    }

    function sparseArrayMax(arr) {
        return sparseArrayLimits(arr).max;
    }

    function sparseArrayLimits(arr) {
        var min = MAX_VALUE,
            max = MIN_VALUE,
            i,
            length = arr.length,
            n;

        for (i = 0; i < length; i++) {
            n = arr[i];
            if (n !== null && isFinite(n)) {
                min = math.min(min, n);
                max = math.max(max, n);
            }
        }

        return {
            min: min === MAX_VALUE ? undefined : min,
            max: max === MIN_VALUE ? undefined : max
        };
    }

    function intersection(a1, a2, b1, b2) {
        var result,
            ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
            u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y),
            ua;

        if (u_b !== 0) {
            ua = (ua_t / u_b);

            result = new Point2D(
                a1.x + ua * (a2.x - a1.x),
                a1.y + ua * (a2.y - a1.y)
            );
        }

        return result;
    }

    function applySeriesDefaults(options, themeOptions) {
        var series = options.series,
            i,
            seriesLength = series.length,
            seriesType,
            seriesDefaults = options.seriesDefaults,
            commonDefaults = deepExtend({}, options.seriesDefaults),
            themeSeriesDefaults = themeOptions ? deepExtend({}, themeOptions.seriesDefaults) : {},
            commonThemeDefaults = deepExtend({}, themeSeriesDefaults);

        cleanupNestedSeriesDefaults(commonDefaults);
        cleanupNestedSeriesDefaults(commonThemeDefaults);

        for (i = 0; i < seriesLength; i++) {

            seriesType = series[i].type || options.seriesDefaults.type;

            var baseOptions = deepExtend(
                { data: [] },
                commonThemeDefaults,
                themeSeriesDefaults[seriesType],
                { tooltip: options.tooltip },
                commonDefaults,
                seriesDefaults[seriesType]
            );

            series[i]._defaults = baseOptions;
            series[i] = deepExtend({}, baseOptions, series[i]);
        }
    }

    function cleanupNestedSeriesDefaults(seriesDefaults) {
        delete seriesDefaults.bar;
        delete seriesDefaults.column;
        delete seriesDefaults.line;
        delete seriesDefaults.verticalLine;
        delete seriesDefaults.pie;
        delete seriesDefaults.donut;
        delete seriesDefaults.area;
        delete seriesDefaults.verticalArea;
        delete seriesDefaults.scatter;
        delete seriesDefaults.scatterLine;
        delete seriesDefaults.bubble;
        delete seriesDefaults.candlestick;
        delete seriesDefaults.ohlc;
        delete seriesDefaults.boxPlot;
        delete seriesDefaults.bullet;
        delete seriesDefaults.verticalBullet;
        delete seriesDefaults.polarArea;
        delete seriesDefaults.polarLine;
        delete seriesDefaults.radarArea;
        delete seriesDefaults.radarLine;
    }

    function applySeriesColors(options) {
        var series = options.series,
            colors = options.seriesColors || [],
            i,
            currentSeries,
            seriesColor,
            defaults;

        for (i = 0; i < series.length; i++) {
            currentSeries = series[i];
            seriesColor = colors[i % colors.length];
            currentSeries.color = currentSeries.color || seriesColor;

            defaults = currentSeries._defaults;
            if (defaults) {
                defaults.color = defaults.color || seriesColor;
            }
        }
    }

    function resolveAxisAliases(options) {
        var alias;

        each([CATEGORY, VALUE, X, Y], function() {
            alias = this + "Axes";
            if (options[alias]) {
                options[this + "Axis"] = options[alias];
                delete options[alias];
            }
        });
    }

    function applyAxisDefaults(options, themeOptions) {
        var themeAxisDefaults = ((themeOptions || {}).axisDefaults) || {};

        each([CATEGORY, VALUE, X, Y], function() {
            var axisName = this + "Axis",
                axes = [].concat(options[axisName]),
                axisDefaults = options.axisDefaults || {};

            axes = $.map(axes, function(axisOptions) {
                var axisColor = (axisOptions || {}).color;
                var result = deepExtend({},
                    themeAxisDefaults,
                    themeAxisDefaults[axisName],
                    axisDefaults,
                    axisDefaults[axisName],
                    {
                        line: { color: axisColor },
                        labels: { color: axisColor },
                        title: { color: axisColor }
                    },
                    axisOptions
                );

                delete result[axisName];

                return result;
            });

            options[axisName] = axes.length > 1 ? axes : axes[0];
        });
    }

    function categoriesCount(series) {
        var seriesCount = series.length,
            categories = 0,
            i;

        for (i = 0; i < seriesCount; i++) {
            categories = math.max(categories, series[i].data.length);
        }

        return categories;
    }

    function sqr(value) {
        return value * value;
    }

    extend($.easing, {
        easeOutElastic: function (n, d, first, diff) {
            var s = 1.70158,
                p = 0,
                a = diff;

            if ( n === 0 ) {
                return first;
            }

            if ( n === 1) {
                return first + diff;
            }

            if (!p) {
                p = 0.5;
            }

            if (a < math.abs(diff)) {
                a=diff;
                s = p / 4;
            } else {
                s = p / (2 * math.PI) * math.asin(diff / a);
            }

            return a * math.pow(2,-10 * n) *
                   math.sin((n * 1 - s) * (1.1 * math.PI) / p) +
                   diff + first;
        }
    });

    function getField(field, row) {
        if (row === null) {
            return row;
        }

        var get = getter(field, true);
        return get(row);
    }

    function getDateField(field, row) {
        if (row === null) {
            return row;
        }

        var key = "_date_" + field,
            value = row[key];

        if (!value) {
            value = toDate(getter(field, true)(row));
            row[key] = value;
        }

        return value;
    }

    function toDate(value) {
        var result,
            i;

        if (value instanceof Date) {
            result = value;
        } else if (typeof value === STRING) {
            result = kendo.parseDate(value) || new Date(value);
        } else if (value) {
            if (isArray(value)) {
                result = [];
                for (i = 0; i < value.length; i++) {
                    result.push(toDate(value[i]));
                }
            } else {
                result = new Date(value);
            }
        }

        return result;
    }

    function toTime(value) {
        if (isArray(value)) {
            return map(value, toTime);
        } else if (value) {
            return toDate(value).getTime();
        }
    }

    function addDuration(date, value, unit, weekStartDay) {
        var result = date,
            hours;

        if (date) {
            date = toDate(date);
            hours = date.getHours();

            if (unit === YEARS) {
                result = new Date(date.getFullYear() + value, 0, 1);
            } else if (unit === MONTHS) {
                result = new Date(date.getFullYear(), date.getMonth() + value, 1);
            } else if (unit === WEEKS) {
                result = addDuration(startOfWeek(date, weekStartDay), value * 7, DAYS);
                kendo.date.adjustDST(result, hours);
            } else if (unit === DAYS) {
                result = new Date(date.getFullYear(), date.getMonth(), date.getDate() + value);
                kendo.date.adjustDST(result, hours);
            } else if (unit === HOURS) {
                result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + value);
                if (value > 0 && dateEquals(date, result)) {
                    result = addDuration(date, value + 1, unit, weekStartDay);
                }
            } else if (unit === MINUTES) {
                result = new Date(date.getTime() + value * TIME_PER_MINUTE);
                result.setSeconds(0);
            } else if (unit === SECONDS) {
                result = new Date(date.getTime() + value * TIME_PER_SECOND);
            }

            if (result.getMilliseconds() > 0) {
                result.setMilliseconds(0);
            }
        }

        return result;
    }

    function startOfWeek(date, weekStartDay) {
        var day = date.getDay(),
            daysToSubtract = 0;

        if (!isNaN(day)) {
            weekStartDay = weekStartDay || 0;
            while (day !== weekStartDay) {
                if (day === 0) {
                    day = 6;
                } else {
                    day--;
                }

                daysToSubtract++;
            }
        }

        return addTicks(date, -daysToSubtract * TIME_PER_DAY);
    }

    function floorDate(date, unit, weekStartDay) {
        date = toDate(date);

        return addDuration(date, 0, unit, weekStartDay);
    }

    function ceilDate(date, unit, weekStartDay) {
        date = toDate(date);

        if (date && floorDate(date, unit, weekStartDay).getTime() === date.getTime()) {
            return date;
        }

        return addDuration(date, 1, unit, weekStartDay);
    }

    function dateDiff(a, b) {
        var diff = a.getTime() - b,
            offsetDiff = a.getTimezoneOffset() - b.getTimezoneOffset();

        return diff - (offsetDiff * TIME_PER_MINUTE);
    }

    function addTicks(date, ticks) {
        var tzOffsetBefore = date.getTimezoneOffset(),
            result = new Date(date.getTime() + ticks),
            tzOffsetDiff = result.getTimezoneOffset() - tzOffsetBefore;

        return new Date(result.getTime() + tzOffsetDiff * TIME_PER_MINUTE);
    }

    function duration(a, b, unit) {
        var diff;

        if (unit === YEARS) {
            diff = b.getFullYear() - a.getFullYear();
        } else if (unit === MONTHS) {
            diff = duration(a, b, YEARS) * 12 + b.getMonth() - a.getMonth();
        } else if (unit === DAYS) {
            diff = math.floor(dateDiff(b, a) / TIME_PER_DAY);
        } else {
            diff = math.floor((b - a) / TIME_PER_UNIT[unit]);
        }

        return diff;
    }

    function singleItemOrArray(array) {
        return array.length === 1 ? array[0] : array;
    }

    function axisGroupBox(axes) {
        var length = axes.length,
            box, i, axisBox;

        if (length > 0) {
            for (i = 0; i < length; i++) {
                axisBox = axes[i].box;

                if (!box) {
                    box = axisBox.clone();
                } else {
                    box.wrap(axisBox);
                }
            }
        }

        return box || Box2D();
    }

    function equalsIgnoreCase(a, b) {
        if (a && b) {
            return a.toLowerCase() === b.toLowerCase();
        }

        return a === b;
    }

    function dateEquals(a, b) {
        if (a && b) {
            return toTime(a) === toTime(b);
        }

        return a === b;
    }

    function lastValue(array) {
        var i = array.length,
            value;

        while (i--) {
            value = array[i];
            if (defined(value) && value !== null) {
                return value;
            }
        }
    }

    function appendIfNotNull(array, element) {
        if (element !== null) {
            array.push(element);
        }
    }

    function lteDateIndex(date, sortedDates) {
        var low = 0,
            high = sortedDates.length - 1,
            i,
            currentDate;

        while (low <= high) {
            i = math.floor((low + high) / 2);
            currentDate = sortedDates[i];

            if (currentDate < date) {
                low = i + 1;
                continue;
            }

            if (currentDate > date) {
                high = i - 1;
                continue;
            }

            while (dateEquals(sortedDates[i - 1], date)) {
                i--;
            }

            return i;
        }

        if (sortedDates[i] <= date) {
            return i;
        } else {
            return i - 1;
        }
    }

    function isNumber(val) {
        return typeof val === "number" && !isNaN(val);
    }

    function countNumbers(values) {
        var length = values.length,
            count = 0,
            i,
            num;

        for (i = 0; i < length; i++) {
            num = values[i];
            if (isNumber(num)) {
                count++;
            }
        }

        return count;
    }

    function areNumbers(values) {
        return countNumbers(values) === values.length;
    }

    function axisRanges(axes) {
        var i,
            axis,
            axisName,
            ranges = {};

        for (i = 0; i < axes.length; i++) {
            axis = axes[i];
            axisName = axis.options.name;
            if (axisName) {
                ranges[axisName] = axis.range();
            }
        }

        return ranges;
    }

    function evalOptions(options, context, state, dryRun) {
        var property,
            propValue,
            excluded,
            defaults,
            depth,
            needsEval = false;

        state = state || {};
        excluded = state.excluded = state.excluded || [];
        defaults = state.defaults = state.defaults || {};
        depth = state.depth = state.depth || 0;

        if (depth > MAX_EXPAND_DEPTH) {
            return;
        }

        for (property in options) {
            if (!inArray(property, state.excluded)&&options.hasOwnProperty(property)) {
                propValue = options[property];
                if (isFn(propValue)) {
                    needsEval = true;
                    if (!dryRun) {
                        options[property] = valueOrDefault(propValue(context), defaults[property]);
                    }
                } else if (typeof propValue === OBJECT) {
                    state.defaults = defaults[property];
                    state.depth++;
                    needsEval = evalOptions(propValue, context, state, dryRun) || needsEval;
                    state.depth--;
                }
            }
        }

        return needsEval;
    }

    function groupSeries(series, data) {
        var result = [],
            nameTemplate,
            legacyTemplate = series.groupNameTemplate,
            groupIx,
            dataLength = data.length,
            seriesClone;

        if (defined(legacyTemplate)) {
            kendo.logToConsole(
                "'groupNameTemplate' is obsolete and will be removed in future versions. " +
                "Specify the group name template as 'series.name'"
            );

            if (legacyTemplate) {
                nameTemplate = template(legacyTemplate);
            }
        } else {
            nameTemplate = template(series.name || "");
            if (nameTemplate._slotCount === 0) {
                nameTemplate = template(defined(series.name) ?
                    "#= group.value #: #= series.name #" :
                    "#= group.value #"
                );
            }
        }

        for (groupIx = 0; groupIx < dataLength; groupIx++) {
            seriesClone = deepExtend({}, series);
            seriesClone.color = undefined;
            seriesClone._groupIx = groupIx;
            result.push(seriesClone);

            if (nameTemplate) {
                seriesClone.name = nameTemplate({
                    series: seriesClone, group: data[groupIx]
                });
            }
        }

        return result;
    }

    function filterSeriesByType(series, types) {
         var i, currentSeries,
             result = [];

         types = [].concat(types);
         for (i = 0; i < series.length; i++) {
             currentSeries = series[i];
             if (inArray(currentSeries.type, types)) {
                 result.push(currentSeries);
             }
         }

         return result;
    }

    function indexOf(item, arr) {
         if (item instanceof Date) {
             for (var i = 0, length = arr.length; i < length; i++) {
                 if (dateEquals(arr[i], item)) {
                     return i;
                 }
             }

             return -1;
         } else {
             return $.inArray(item, arr);
         }
    }

    function sortDates(dates, comparer) {
         comparer = comparer || dateComparer;

         for (var i = 1, length = dates.length; i < length; i++) {
             if (comparer(dates[i], dates[i - 1]) < 0) {
                 dates.sort(comparer);
                 break;
             }
         }

         return dates;
    }

    // Will mutate srcDates, not cloned for performance
    function uniqueDates(srcDates, comparer) {
        var i,
            dates = sortDates(srcDates, comparer),
            length = dates.length,
            result = length > 0 ? [dates[0]] : [];

        comparer = comparer || dateComparer;

        for (i = 1; i < length; i++) {
            if (comparer(dates[i], last(result)) !== 0) {
                result.push(dates[i]);
            }
        }

        return result;
    }

    function isDateAxis(axisOptions, sampleCategory) {
        var type = axisOptions.type,
            dateCategory = sampleCategory instanceof Date;

        return (!type && dateCategory) || equalsIgnoreCase(type, DATE);
    }

    function transpose(rows) {
        var result = [],
            rowCount = rows.length,
            rowIx,
            row,
            colIx,
            colCount;

        for (rowIx = 0; rowIx < rowCount; rowIx++) {
            row = rows[rowIx];
            colCount = row.length;
            for (colIx = 0; colIx < colCount; colIx++) {
                result[colIx] = result[colIx] || [];
                result[colIx].push(row[colIx]);
            }
        }

        return result;
    }

    function ensureTree(fieldName, target) {
        if (fieldName.indexOf(".") > -1) {
            var parts = fieldName.split("."),
                path = "",
                val;

            while (parts.length > 1) {
                path += parts.shift();
                val = kendo.getter(path)(target) || {};
                kendo.setter(path)(target, val);
                path += ".";
            }
        }
    }

    // Exports ================================================================
    dataviz.ui.plugin(Chart);

    PlotAreaFactory.current.register(CategoricalPlotArea, [
        BAR, COLUMN, LINE, VERTICAL_LINE, AREA, VERTICAL_AREA,
        CANDLESTICK, OHLC, BULLET, VERTICAL_BULLET, BOX_PLOT
    ]);

    PlotAreaFactory.current.register(XYPlotArea, [
        SCATTER, SCATTER_LINE, BUBBLE
    ]);

    PlotAreaFactory.current.register(PiePlotArea, [PIE]);
    PlotAreaFactory.current.register(DonutPlotArea, [DONUT]);

    SeriesBinder.current.register(
        [BAR, COLUMN, LINE, VERTICAL_LINE, AREA, VERTICAL_AREA],
        [VALUE], [CATEGORY, COLOR, NOTE_TEXT, ERROR_LOW_FIELD, ERROR_HIGH_FIELD]
    );

    DefaultAggregates.current.register(
        [BAR, COLUMN, LINE, VERTICAL_LINE, AREA, VERTICAL_AREA],
        { value: "max", color: "first", noteText: "first", errorLow: "min", errorHigh: "max" }
    );

    SeriesBinder.current.register(
        [SCATTER, SCATTER_LINE, BUBBLE],
        [X, Y], [COLOR, NOTE_TEXT, X_ERROR_LOW_FIELD, X_ERROR_HIGH_FIELD, Y_ERROR_LOW_FIELD, Y_ERROR_HIGH_FIELD]
    );

    SeriesBinder.current.register(
        [BUBBLE], [X, Y, "size"], [COLOR, CATEGORY, NOTE_TEXT]
    );

    SeriesBinder.current.register(
        [CANDLESTICK, OHLC],
        ["open", "high", "low", "close"], [CATEGORY, COLOR, "downColor", NOTE_TEXT]
    );

    DefaultAggregates.current.register(
        [CANDLESTICK, OHLC],
        { open: "max", high: "max", low: "min", close: "max",
          color: "first", downColor: "first", noteText: "first" }
    );

    SeriesBinder.current.register(
        [BOX_PLOT],
        ["lower", "q1", "median", "q3", "upper", "mean", "outliers"], [CATEGORY, COLOR, NOTE_TEXT]
    );

    DefaultAggregates.current.register(
        [BOX_PLOT],
        { lower: "max", q1: "max", median: "max", q3: "max", upper: "max", mean: "max", outliers: "first",
          color: "first", noteText: "first" }
    );

    SeriesBinder.current.register(
        [BULLET, VERTICAL_BULLET],
        ["current", "target"], [CATEGORY, COLOR, "visibleInLegend", NOTE_TEXT]
    );

    DefaultAggregates.current.register(
        [BULLET, VERTICAL_BULLET],
        { current: "max", target: "max", color: "first", noteText: "first" }
    );

    SeriesBinder.current.register(
        [PIE, DONUT],
        [VALUE], [CATEGORY, COLOR, "explode", "visibleInLegend", "visible"]
    );

    deepExtend(dataviz, {
        EQUALLY_SPACED_SERIES: EQUALLY_SPACED_SERIES,

        Aggregates: Aggregates,
        AreaChart: AreaChart,
        AreaSegment: AreaSegment,
        AxisGroupRangeTracker: AxisGroupRangeTracker,
        Bar: Bar,
        BarAnimationDecorator: BarAnimationDecorator,
        BarChart: BarChart,
        BarLabel: BarLabel,
        BubbleAnimationDecorator: BubbleAnimationDecorator,
        BubbleChart: BubbleChart,
        BulletChart: BulletChart,
        CandlestickChart: CandlestickChart,
        Candlestick: Candlestick,
        CategoricalChart: CategoricalChart,
        CategoricalErrorBar: CategoricalErrorBar,
        CategoricalPlotArea: CategoricalPlotArea,
        CategoryAxis: CategoryAxis,
        ChartContainer: ChartContainer,
        ClusterLayout: ClusterLayout,
        Crosshair: Crosshair,
        CrosshairTooltip: CrosshairTooltip,
        DateCategoryAxis: DateCategoryAxis,
        DateValueAxis: DateValueAxis,
        DefaultAggregates: DefaultAggregates,
        DonutChart: DonutChart,
        DonutPlotArea: DonutPlotArea,
        DonutSegment: DonutSegment,
        ErrorBarBase: ErrorBarBase,
        ErrorRangeCalculator: ErrorRangeCalculator,
        Highlight: Highlight,
        SharedTooltip: SharedTooltip,
        Legend: Legend,
        LineChart: LineChart,
        LinePoint: LinePoint,
        LineSegment: LineSegment,
        Pane: Pane,
        PieAnimation: PieAnimation,
        PieAnimationDecorator: PieAnimationDecorator,
        PieChart: PieChart,
        PiePlotArea: PiePlotArea,
        PieSegment: PieSegment,
        PlotAreaBase: PlotAreaBase,
        PlotAreaFactory: PlotAreaFactory,
        PointEventsMixin: PointEventsMixin,
        ScatterChart: ScatterChart,
        ScatterErrorBar: ScatterErrorBar,
        ScatterLineChart: ScatterLineChart,
        Selection: Selection,
        SeriesAggregator: SeriesAggregator,
        SeriesBinder: SeriesBinder,
        ShapeElement: ShapeElement,
        SplineSegment: SplineSegment,
        SplineAreaSegment: SplineAreaSegment,
        StackWrap: StackWrap,
        Tooltip: Tooltip,
        OHLCChart: OHLCChart,
        OHLCPoint: OHLCPoint,
        XYPlotArea: XYPlotArea,

        addDuration: addDuration,
        areNumbers: areNumbers,
        axisGroupBox: axisGroupBox,
        categoriesCount: categoriesCount,
        ceilDate: ceilDate,
        countNumbers: countNumbers,
        duration: duration,
        ensureTree: ensureTree,
        indexOf: indexOf,
        isNumber: isNumber,
        floorDate: floorDate,
        filterSeriesByType: filterSeriesByType,
        lteDateIndex: lteDateIndex,
        evalOptions: evalOptions,
        singleItemOrArray: singleItemOrArray,
        sortDates: sortDates,
        sparseArrayLimits: sparseArrayLimits,
        startOfWeek: startOfWeek,
        transpose: transpose,
        toDate: toDate,
        toTime: toTime,
        uniqueDates: uniqueDates
    });

})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
