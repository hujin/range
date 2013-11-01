define("range",["$", "widget", "base", "class", "events","./range-debug.css"],function(require, exports, module){

    var $=require("$");
    var Widget = require("widget");
    require("./range-debug.css");
	var Range=Widget.extend({
		attrs: {
             // 可以是 Selector、jQuery 对象、或 DOM 元素集
            triggers: {
                value: '',
                getter: function(val) {
                    return $(val);
                }
            },
            // 是否包含 triggers，用于没有传入 triggers 时，是否自动生成的判断标准
            hasTriggers: true,
            // 触发类型
            triggerType: "hover",
            // or 'click'
            // 触发延迟
            delay: 100,
            minValue:-10,
            maxValue:100,
            unit:'',
            lattice:10,
            actualValue:0,
            // 初始切换到哪个面板
            activeIndex: {
                value: 0
            }
        },
        events: {
            'mousedown .range-slider-container': 'onStart',
            'mouseup .range-slider-container' :'onEnd',
            'mouseout .range-slider-container':'unbindEvent',
            'click .range .prev':'onPrev',
            'click .range .next':'onNext'
        },
        setup:function(){
            var actualValue = this.get("actualValue"),
                minValue = this.get("minValue"),
                maxValue = this.get("maxValue");

            if(actualValue< minValue || actualValue >maxValue){
                alert("初始值不能小于最小设定值 或大于最大设定值");
                return false;
            }
        	this.init();
            this.resize(actualValue);
        },
        resize:function(value){
            var rangeSub=this.element.find(".range-slider-sub");
            var width = parseInt(this.element.find(".range-slider").css("width")),
                totalValue= this.get("maxValue") - this.get("minValue"),
                rangeWidth=((value-this.get("minValue"))/totalValue) * width;

            this.element.find(".range-value").html(value + this.get("unit"));
            rangeSub.css("width",rangeWidth + "px");
            this.element.find(".range-slider-handle").css("left",(rangeWidth-8) + "px");
        },
        init:function(){
            var strhtml="";
            strhtml="<div class=\"range\">";
            strhtml+="  <a class=\"prev\"></a>"
            strhtml+="  <div class=\"range-slider-container\">";
            strhtml+="      <div class=\"range-slider\">";
            strhtml+="          <div class=\"range-slider-sub\"></div>";
            strhtml+="          <span class=\"range-slider-handle\"><span class=\"range-value\"></span></span>";            
            strhtml+="      </div>";
            strhtml+="  </div>";
            strhtml+="  <a class=\"next\"></a>";
            strhtml+="</div>"

            this.element.html(strhtml);
        },
        onStart:function(e){
            var minValue =this.get("minValue"),
                maxValue =this.get("maxValue"),
                unit =this.get("unit"),
                totalValue= maxValue - minValue;
            this.element.find(".range-slider-container").bind("mousemove",function(e){
                var rangeSub=$(this).find(".range-slider-sub");                      
                var rangeWidth=e.clientX-rangeSub.offset().left,
                    width = parseInt($(this).find(".range-slider").css("width"));

                if(rangeWidth<0){
                    rangeWidth=0;
                }
                if(rangeWidth>214){
                    rangeWidth=214;
                }
                $(this).find(".range-value").html((rangeWidth/width)*totalValue + minValue + unit);
                rangeSub.css("width",rangeWidth + "px");
                $(this).find(".range-slider-handle").css("left",(rangeWidth-8) + "px");  
            });
        },
        onEnd:function(e){
            this.element.find(".range-slider-container").unbind("mousemove");
            var rangeSub=this.element.find(".range-slider-sub");
            var rangeWidth=e.clientX-rangeSub.offset().left,
                width = parseInt(this.element.find(".range-slider").css("width")),
                totalValue= this.get("maxValue") - this.get("minValue");
                    
            if(rangeWidth<0){
                rangeWidth=0;
            }
            if(rangeWidth>214){
                rangeWidth=214;
            }
            this.set("actualValue",((rangeWidth/width)*totalValue + this.get("minValue")));
            this.element.find(".range-value").html(this.get("actualValue")  + this.get("unit"));
            rangeSub.css("width",rangeWidth + "px");
            this.element.find(".range-slider-handle").css("left",(rangeWidth-8) + "px");
        
        },
        unbindEvent:function(){
            this.element.find(".range-slider-container").unbind("mousemove");
        },
        onPrev:function(e){
            var width = parseInt($(this.element.selector).find(".range-slider").css("width")),
                lattices =this.get("lattice"),
                lattice =width/lattices,
                rangeSub=$(this.element.selector).find(".range-slider-sub"),
                rangeWidth=parseInt(rangeSub.css("width")) -lattice,
                totalValue= this.get("maxValue") - this.get("minValue"),
                actualValue =this.get("actualValue");
            
            if(rangeWidth<0){
                rangeWidth=0;
            }
            this.set("actualValue",(actualValue- (totalValue/lattices)));
            $(this.element.selector).find(".range-value").html(this.get("actualValue")  + this.get("unit"));
            rangeSub.css("width",rangeWidth + "px");
            $(this.element.selector).find(".range-slider-handle").css("left",(rangeWidth-8) + "px");
        },
        onNext:function(e){
            var width = parseInt($(this.element.selector).find(".range-slider").css("width")),
                lattices =this.get("lattice"),
                lattice =width/lattices,
                rangeSub=$(this.element.selector).find(".range-slider-sub"),
                rangeWidth=parseInt(rangeSub.css("width")) + lattice,
                totalValue= this.get("maxValue") - this.get("minValue"),
                actualValue =this.get("actualValue");

            if(rangeWidth>214){
                rangeWidth=214;
            }

   
            this.set("actualValue",(actualValue + (totalValue/lattices)));
            $(this.element.selector).find(".range-value").html(this.get("actualValue")  + this.get("unit"));
            rangeSub.css("width",rangeWidth + "px");
            $(this.element.selector).find(".range-slider-handle").css("left",(rangeWidth-8) + "px");
        }
	});
	module.exports = Range;

})