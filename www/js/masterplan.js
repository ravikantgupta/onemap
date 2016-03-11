	/**
	 * Copyright @ URA 
	 * Functions specific to Master Plan 2014
	 */
	var ONEMAP_API_URL1 = "https://www.onemap.sg/SystemServices/Services.svc/";  
	//var ONEMAP_LOT_TOKEN = "rVV4jR8mJ9EkR4lv+w5rO8ZvBEixc5KfOwjQ8YnqEjvD6uX6E/5UBe4663d6dvWgQgb/KYARJFdGEHT3fyTzE4sqhg6FyeYOHJihKNlOxK2jd4q1qpcsFA==|mv73ZvjFcSo="; //commented by lavanya satuluri 30 oct for getnewtoken
	//var ONEMAP_LOT_SEARCH_URL = ONEMAP_API_URL1 + 'querytask?token='+ONEMAP_LOT_TOKEN;	//commented by lavanya satuluri 30 oct for getnewtoken
	
	var PLANNING_AREA_URL = "https://www.ura.gov.sg/ArcGis/rest/services/ppg/Singapore_Planning_Boundaries/MapServer/1";

	var arrayPlanAreaSelected = new Array(); // array to keep track of the selected Plan Aread for download
	var arrayPlanAreaSelectedLayer = new Array(); // array to keep track of the selected Plan Aread Layer for download
    var arrayLotNumSelected = new Array(); // array to keep track of lot numbers added
	var arrayLotNumQty = new Array(); // array to keep track of lot number quantities - 1 by default
	var centralAreaFlagArray = new Array(); // array to keep track of inside or outside central area flag
	var arrayGraphicsAdded = new Array();  // array to keep track of graphics layers added to the map	
	var polygonGraphicsLayer = "";
	
	var lotFlag = 0; var buyFlag = 0; var amount_paid_glb = 0 ;var postage_glb = 0 ;var buyMasterPlanFlag = 0;
	var rightdrawerShowFlag = 0;
	
	var planningboundary_featureLayer = "";	var dwnldPlan = 0;
	
	var audePlanFlag = 0; // added by lavanya 20-Aug-2014
	
	var layer1 = "" ; var layer2 = "" ; 
	var pln_area_name = ""; 	var citylayerflag = 0;
	var cityLayer;	
	
	/**
	 * When CIP function is enabled on right drawer,add the land lot map for the user to select the lots	 
	 */ 
	function  cipFunctionEnabled(id)	{
	 mapLoadEvents() // added by lavanya satuluri 17-sept-2014 watercolor basemap - to destroy the previous map properties
	 audeSelect = 0; // added by lavanya satuluri 1-oct-2014 
	 $("#rightDrawerShowHidebtn").attr('class', 'rightDrawerShowHidebtnMin'); // added by lavanya satuluri 12-sept-2014 to change direction of arrow in right panel
	 document.getElementById("divRightPanel_AUDE").style.display="none";	//added by lavanya satuluri 22-Aug-2014
	 document.getElementById("idAUDEBtn").style.backgroundColor="#36393E"; //added by lavanya satuluri 22-Aug-2014
	 
		var leftspace =  "16px";
		var divOpacityLeft = "45%";
		var rightspace;
		
		/*** Clear all down master plan functionalities **/
		document.getElementById("iddwldBtn").style.backgroundColor="#36393E";							
		map.graphics.clear();
		ClearGraphicsLayers ();						
		arrayPlanAreaSelected = new Array();
		document.getElementById("divtblSelectedPA").innerHTML = "";
		document.getElementById('divtbldownloadPAbtn').innerHTML = "";
		document.getElementById("Particularsttxtname").value = "";
		document.getElementById("Particularsrole").value = "";
		document.getElementById("divSelectPA").style.display = "block";
		document.getElementById("NoPLSelDiv").style.display = "block";
		document.getElementById("DivParticulars").style.display = "none";
		document.getElementById("divDownloadPA").style.display = "none";
		document.getElementById("IsWideCbeckbox").checked = false;
		/** hide the rightDrawer **/
						
		//map.graphics.clear();
		/** Clear graphics **/
		//ClearGraphicsLayers ();
	
		dwnldPlan = 0;
		leftdrawerShowFlag = 0;
			
		/** On the left panel, when you click on “Buy Certified Interpretation Plan”,  collapse the left panel **/
		  $(".leftDrawer").hide("slide", {direction : "left"}, "slow");
		  						 
		   $('#map-canvas_zoom_slider').animate({
						left : leftspace,					
						display: 'toggle'
				}, "slow");			 
		  		  
		  		  
		    $('.header').animate({
				 position: 'absolute',
					marginLeft: '0px',
					display: 'toggle'
			}, "slow");
			if(document.getElementById("search-suggest").style.display == "block")
			 {
			  $('.search-suggest').animate({
				 position: 'absolute',
					marginLeft: '0px',
					display: 'toggle'
				}, "slow");
			 }		
			if (citylayerflag == 1)
			{ 
					if(citylayerflag == 1){map.removeLayer(cityLayer); citylayerflag=0;}	
			}
			document.getElementById("divSPALabel").style.display = "none";
						
			/** Show all maps except lA**/
			for (var i = 1; i < 10; i++) {	// changed from 9 to 10 - lavanya satuluri 29 Aug 2014 - AUDE						  									
					$('#tblMap tr:nth-child(' + i + ')').show();				
			}
			
		/** On the left panel, when you click on “Buy Certified Interpretation Plan”,  collapse the left panel **/
		
		var value = id.id;
		if(buyMasterPlanFlag == 0)
			{   /** Selected buy CIP ***/
				document.getElementById(id.id).style.backgroundColor="#272B2E"; //changing button color to show it is selected
				$(".rightDrawer").show("slide", {direction : "right"}, "slow");
				document.getElementById("cipText").innerHTML = "Buy Certified Interpretation Plan";				
				document.getElementById("DownloadWindow").style.display = "none";
				
				$("#cipText").addClass('cipTextBP');
								
				/** Min/Max Button **/
				rightspace = $('#rightDrawer').width();			
				document.getElementById("divrightDrawerShowHidebtn").style.display="block";
				$('#divrightDrawerShowHidebtn').animate({
						right : rightspace,					
						display: 'toggle'
				}, "slow");			 
				
				document.getElementById("firstWindow").style.display = "block";
								
				/** Start - Hide all maps except "Land Lot Map" and "Street Map" **/				
				for (var i = 1; i < 9; i++) {	// changed from 8 to 9 - lavanya satuluri 29 Aug 2014 - AUDE					  									
					$('#tblMap tr:nth-child(' + i + ')').hide();				
				}		
				$('#tblMap tr:last-child').show();						
				document.getElementById("txtSelectedMap").innerHTML = "Land Lot Map";				
				
				/** SetVisibility to false for all added map except Street map and Land Lot Map ***/				
				
				for (var i = 0; i <= addedMapsArray.length-1; i++) {					  																	
					if(addedMapsArray[i] == "map_mp14"){MP14Map.setVisibility(false);}
					if(addedMapsArray[i] == "map_pwb"){PW14Map.setVisibility(false);}
					if(addedMapsArray[i] == "map_lha"){LHAPMap.setVisibility(false);}
					if(addedMapsArray[i] == "map_sbud"){SBPUMap.setVisibility(false);}
					if(addedMapsArray[i] == "map_bhp"){BHPMap.setVisibility(false);}				
					if(addedMapsArray[i] == "map_agu"){AGUPMap.setVisibility(false);}	
                    if(addedMapsArray[i] == "wcb"){WaterColorMap.setVisibility(false);}		//added by lavanya satuluri 29 Aug 2014 AUDE	
					if(addedMapsArray[i] == "iss"){InventorySalesMap.setVisibility(false);}		//added by Bably 23 Oct 2014
					
				}				
				/** End - Hide all maps except "Land Lot Map" and "Street Map" **/
								
				buyMasterPlanFlag = 1; //switched on
				
				//Switch the current map to land to to map
				switchMap('ollm',false);
				lotFlag = 1
				populateDrDn()
								
				//if(flagollm == 0)/**to check if land lot map is already added from basemap window**/
				//{										
				//	map.addLayer(LandLotMap);				
				//	flagollm = 1;	
				//	flagupdatedmp=0;
										
					/*enable the same in pop-up base map window*/
				//	document.getElementById('ollm_sel').style.display="block"; //displaying checkicon					
				//	addedMapsArray.push("ollm");									
				//	populateDrDn(); /* populate the transparency drop-down */					
				//	//LandLotMap.setOpacity(0.5);
				//	//dijit.byId("horizontalSlider").set("value", 50); // landlot map transparency is 50% when added
				//	LandLotMap.setOpacity(1.0);
				//	dijit.byId("horizontalSlider").set("value", 100); // landlot map transparency is 50% when added
				//	lotFlag = 1; /*to enable doQuery method*/					
				//									
				//	if (typeof LandLotMap.tileInfo == "undefined") {
				//		map._params.maxZoom = 8;						
				//	}
				//	else {
				//		map._params.maxZoom = LandLotMap.tileInfo.lods.length - 1;
				//	}					
				//}
													
				if(isIpad==true) {
					divOpacityLeft = window.innerWidth - $("#rightDrawer").width() - $("#divOpacity").width() - 50 ;
					divOpacityLeft = divOpacityLeft + "px";					
					$('#divOpacity').animate({
						left : divOpacityLeft,					
						display: 'toggle'
					}, "slow");			 
				}			
			}			
		else
			{
			    /** Unselected buy CIP ***/
				document.getElementById(id.id).style.backgroundColor="#36393E";
				$(".rightDrawer").hide("slide", {direction : "right"}, "slow");
				buyMasterPlanFlag = 0; //switched off
				
				//Switch the current map to Update MP
				switchMap('map_updatedmp',false);				
				map._params.maxZoom = 6;
				for(var i=0;i<addedMapsArray.length;i++)
				{
				  if(addedMapsArray[i] == "ollm")
					{
						addedMapsArray.splice(i, 1);	
						break;
					}	
										
				}
				if(addedMapsArray.length == 1){	document.getElementById('divOpacity').style.display="none"; }				
				document.getElementById('ollm_sel').style.display="none"; //removing checkicon				
				document.getElementById("firstWindow").style.display = "none";
				
				/** Min/Max Button **/
				rightspace = -28;						
				$('#divrightDrawerShowHidebtn').animate({
						right : rightspace,					
						display: 'toggle'
				}, "slow");			 
				$(".rightDrawer").hide("slide", {direction : "right"}, "slow");	
				document.getElementById("divrightDrawerShowHidebtn").style.display="block";
			
				/** SetVisibility to false for all added map that previously hide. ***/				
				for (var i = 0; i <= addedMapsArray.length-1; i++) {						
					if(addedMapsArray[i] == "map_mp14"){MP14Map.setVisibility(true);}
					if(addedMapsArray[i] == "map_pwb"){PW14Map.setVisibility(true);}
					if(addedMapsArray[i] == "map_lha"){LHAPMap.setVisibility(true);}
					if(addedMapsArray[i] == "map_sbud"){SBPUMap.setVisibility(true);}
					if(addedMapsArray[i] == "map_bhp"){BHPMap.setVisibility(true);}				
					if(addedMapsArray[i] == "map_agu"){AGUPMap.setVisibility(true);}
                    if(addedMapsArray[i] == "wcb"){WaterColorMap.setVisibility(true);}		//added by lavanya satuluri 29 Aug 2014 AUDE
					if(addedMapsArray[i] == "iss"){InventorySalesMap.setVisibility(true);}		//added by Bably 23 Oct 2014
				}			
				/** End - Hide all maps except "Land Lot Map" and "Street Map" **/
			    map.reorderLayer(MP14Map, 0);		
				populateDrDn(); /* reconstruct the drop down by removing the landlot layer */	
				lotFlag = 0;/*to disable doQuery method*/
				/**move the basemap and opacity combined div accordingly **/
				//document.getElementById("divOpacity").style.left="70%" ;		

				/**clear the selected plan and amount in the sales window  right drawer**/
				$(".salesWindow").hide(500);	
				$(".firstWindow").show(500);					
				document.getElementById('ShopCartTotalitems').style.display="none";
				document.getElementById('lblTotalItems').innerHTML = "";
				document.getElementById('divShopingCart').innerHTML = "";
				document.getElementById('lblTotalCost').innerHTML = "";							
				document.getElementById("lblTotalCost").style.display="none";
				document.getElementById("cip2014").checked = true;
				document.getElementById("CZIP80").checked = false;
				document.getElementById("CZIP58").checked = false;
				arrayLotNumSelected = new Array();
				centralAreaFlagArray = new Array();
				arrayGraphicsAdded = new Array();
				amount_paid_glb = 0;
				postage_glb=0;
				
				/** hide Land Lot Map **/
				$('#tblMap tr:last-child').hide();		
						
				if(isIpad==true) {
					/** check if portrait or landscape **/
					if (window.innerHeight > window.innerWidth) {	/** portrait **/
						divOpacityLeft = '35%';
					}
					else {/** lanscape **/
						divOpacityLeft = '40%';
					}
				}
				
				$('#divOpacity').animate({
						left : divOpacityLeft,					
						display: 'toggle'
				}, "slow");			 				 
			}
			CheckSetMapZoomMax ();	
            closeLegend(); //added by lavanya satuluri 15 oct 2014			
		}

	/**
	 * On clicking on the map raise an event to highlight the Lot-Number selected by querying the one map service
	 */
	function doQuery(evt){
		
		if(lotFlag == 1) /** buy plan **/
		{		
			$(".firstWindow").hide(500);	
			$(".salesWindow").show(500);	
			
			var x = evt.mapPoint.x ;
			var y = evt.mapPoint.y ;
			
			queryLandLot(x, y);	/** Query Land Lot  and display the polygon **/
		    
			/** To check if the polygon is inside or outside central area **/
			queryTask = new esri.tasks.QueryTask("https://www.ura.gov.sg/ArcGIS/rest/services/common/Singapore_Planning_Boundaries/MapServer/3");
			query = new esri.tasks.Query();
			var XY = new esri.geometry.Point (x,y, new esri.SpatialReference({ wkid: 3414 }));
			query.returnGeometry = true;
			query.geometry = XY;
			query.outSpatialReference = {wkid:3414}; 
			query.outFields = ["*"];			
			queryTask.execute(query,centralAreaCheck);	
			
			 	
		}
	}
	 /**
	 * To check if the polygon is inside or outside central area
	 */
	function centralAreaCheck(featureSet){	
		var count = featureSet.features.length;		
		if(count > 0) /* Inside CA */
		{
			//centralAreaFlagArray.push(1);
			centralAreaFlagArray.push("CIP2014");
		}
		else
		{
			//centralAreaFlagArray.push(0);
			centralAreaFlagArray.push("CMP2014");
		}
		
	}
	 /**
	 * Query Land Lot 
	 */
	function queryLandLotOriginalLSAug27(x,y){	//this is a back up to update code for onemap new token
		var queryType = "LANDLOT";
		var url = ONEMAP_LOT_SEARCH_URL + '&queryType='+queryType+'&queryPoint='+x+","+y;	
	
		if ( window.XDomainRequest){ // IE need use specific code to run XDR
				var xdr = new XDomainRequest();
				xdr.onload = function(){
					var text = xdr.responseText;
					var data = {};
					if (text[0] == '[' ){ //check no result response
					
					}else {
						data = JSON.parse(text);
					}
				
					if (data) {
					   displayPolygon(data.features);
					}
					 
				};
				xdr.onerror = function(err){
					 alert("error");
				};
				xdr.timeout = 1000;
				xdr.ontimeout = function(){
					 alert("error");
				};
				/** console.log("url=" + url); **/
				xdr.open('http://www.ura.gov.sg/uol/invalid-page-message', url);
				xdr.send(null);
				
			} else{// For other browsers
			
		    dojo.xhrGet({
				url: url,
				handleAs: "json",
				headers: {                     
				"X-Requested-With": ""
				},			      
				crossDomain : true,
				load: function(data) {
				displayPolygon(data.features);
				},
				error: function(err) {
				alert(err);
				}
			});  
		 
			
			}
	}
	function queryLandLot(x,y){	
	    var ONEMAP_LOT_GETNEWTOKEN = getOneMapLandLotToken(); //lavanya 30 oct 2014
		//var ONEMAP_LOT_SEARCH_URL = ONEMAP_API_URL1 + 'querytask?token='+ONEMAP_LOT_GETNEWTOKEN; //added and commented by lavanya 30 oct 2014
		var ONEMAP_LOT_SEARCH_URL = ONEMAP_API_URL1 + 'getLODetails?token='+ONEMAP_LOT_GETNEWTOKEN; //lavanya 30 oct 2014
		var queryType = "LANDLOT";
		var url = ONEMAP_LOT_SEARCH_URL + '&queryType='+queryType+'&queryPoint='+x+","+y;	
	
		if ( window.XDomainRequest){ // IE need use specific code to run XDR
				var xdr = new XDomainRequest();
				xdr.onload = function(){
					var text = xdr.responseText;
					var data = {};
					if (text[0] == '[' ){ //check no result response
					
					}else {
						data = JSON.parse(text);
					}
				
					if (data) {
					   displayPolygon(data.features);
					}
					 
				};
				xdr.onerror = function(err){
					 alert("error");
				};
				xdr.timeout = 1000;
				xdr.ontimeout = function(){
					 alert("error");
				};
				/** console.log("url=" + url); **/
				xdr.open('http://www.ura.gov.sg/uol/invalid-page-message', url);
				xdr.send(null);
				
			} else{// For other browsers
			
		    dojo.xhrGet({
				url: url,
				handleAs: "json",
				headers: {                     
				"X-Requested-With": ""
				},			      
				crossDomain : true,
				load: function(data) {
				displayPolygon(data.features);
				},
				error: function(err) {
				alert(err);
				}
			});  
		 
			
			}
	}
	
	
	
	
	//Lavanya Satuluri aug27
	function getOneMapLandLotToken(){
	     var tokenLL = "";
		  var urlLL = "";
		  urlLL =  "https://www.onemap.sg/AuthServices/TokenService.svc/GetNewToken";
		  // if(window.location.protocol == 'https:') {						   			  
			   // urlLL =  "https://www.onemap.sg/AuthServices/TokenService.svc/GetNewToken";
			// }
			// else {			   
			   // urlLL =  "http://www.onemap.sg/AuthServices/TokenService.svc/GetNewToken";
		    // }
      
		// var urlLL = "https://uat.onemap.sg/AuthServices/TokenService.svc/GetNewToken";
         var accessKeyLL = "rVV4jR8mJ9EkR4lv+w5rO8ZvBEixc5KfOwjQ8YnqEjvD6uX6E/5UBe4663d6dvWgQgb/KYARJFdGEHT3fyTzE4sqhg6FyeYOHJihKNlOxK2jd4q1qpcsFA==|mv73ZvjFcSo=";
         var params = { AccessKey: accessKeyLL };
         var parameters = JSON.stringify(params);
         $.support.cors = true;
		 
		 // if ( window.XDomainRequest){ // IE need use specific code to run XDR
				// var xdr = new XDomainRequest();
				// xdr.onload = function(){
					// var text = xdr.responseText;
					// var data = {};
					// if (text[0] == '[' ){ //check no result response
					
					// }else {
						// data = JSON.parse(text);
					// }
					// if (data) {
					  // alert(data);
					// } 
				// };
				// xdr.onerror = function(err){
					 // alert("error");
				// };
				// xdr.timeout = 1000;
				// xdr.ontimeout = function(){
					 // alert("error");
				// };
				// /** console.log("url=" + url); **/
				
				// xdr.open('POST', 'https://www.onemap.sg/AuthServices/TokenService.svc/GetNewToken'); // index.php is just print_r($_POST) or print_r($_REQUEST)
                // xdr.setRequestHeader('Content-Type', 'application/json');
                // xdr.setRequestHeader('Accept', 'application/json');
                // xdr.send(parameters);
			// }
			// else{
		 
		 
 $.ajax({
         type: 'POST',
         url: urlLL,
         data: parameters,
		 cache: false,
         crossDomain: true,
         contentType: 'application/json; charset=utf-8',
         dataType: 'json', 
         async: false,		 
         success: function (response) {
             tokenLL = response.Token;    
         },
         error: function (jqXHR, textStatus, errorThrown) {
		  console.log(jqXHR.statusText);
          console.log(textStatus);
          console.log(errorThrown);
             alert('ErrorToken');
         }
     });
	 //}
	 return tokenLL;	
	}
	
	/**
	 * Highlight the selected lot
	 */
	function displayPolygon(features){
 
		    var length = features.length;
			var flagex = 0 ; //to check if lot is already in list
			
			/* To highlight the polygon on the map */
			polygonGraphicsLayer = new esri.layers.GraphicsLayer();
			map.addLayer(polygonGraphicsLayer);
			var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255,0.65]), 2), new dojo.Color([0,0,255,0.35]));
			var polys = new esri.geometry.Polygon();
			
			if(length == 1) /* will be 1 always *for testing*/
			{
				var lotNumber = features[0].attributes.LOT_KEY;
				
				if(arrayLotNumSelected.length > 0)
				{
				
				for(var i=0;i<arrayLotNumSelected.length;i++)
					{
					  if(arrayLotNumSelected[i] == lotNumber)
						{
							flagex =  1;					
							break;
						}	
											
					}
				}	
				//if(arrayLotNumSelected.indexOf(lotNumber)==-1) /*doesn't exist in the array - to avoid duplicates*/
				if(flagex == 0) /** indexOf doesnt work in IE**/
				{
					var featureGeom = features[0].geometry;
					for (var k=0, kl=featureGeom.rings.length; k<kl; k++) /* Iterating through each polygon rings in geometry object */
					{
						var featureGeomRing = featureGeom.rings[k];
						polys.addRing(featureGeomRing);
					}
					XYGraphic = new esri.Graphic(polys, symbol);
					polygonGraphicsLayer.add(XYGraphic); /* Adding graphics to the polygon */
					arrayGraphicsAdded.push(polygonGraphicsLayer.graphics[0]); // store the graphics added					
					arrayLotNumSelected.push(lotNumber);					
					arrayLotNumQty.push("1"); /** to retain the latest quantity value updated - by default it is 1**/
					populateShoppingCart();
				}
				else
				{
					var message = "Lot-Number :" + lotNumber + " is already in list";
					showDialog(message);
				}
			}
	}

	/**
	 * When check out is clicked go to step2 and construct the shopping cart
	 */
	function populateShoppingCart(){	
			//alert("populate shopping cart");
			document.getElementById('divShopingCart').innerHTML = "";
			var htmlStr = "<table id='tblShopingCart' bgcolor='#36393E' width='95%' padding-left='10px' border=0>";
			htmlStr = htmlStr + "<tr><th class='tblShoppingCartCol1' ><span>Selected Plans</span></th><th class='tblShoppingCartCol2'><span>Qty</span></th><td class='tblShoppingCartCol3'></td></tr>";
			for(var i=0;i<arrayLotNumSelected.length;i++)//for testing
				{
					var index = i+1;
					var str1 = "qty";
					var str2 = "price";
 
						htmlStr = htmlStr + "<tr bgcolor='#36393E'>";
						
							htmlStr = htmlStr + "<td class='tblShoppingCartItem'><span>";
							htmlStr = htmlStr + arrayLotNumSelected[i] ;
							htmlStr = htmlStr + "</span></td>";
							
							htmlStr = htmlStr + "<td align='center' bgcolor='#36393E' >";
							htmlStr = htmlStr + ' <input class=tblShoppingCartItem id= '+str1+i+' value='+arrayLotNumQty[i]+' style=width:12px;border-radius:3px onkeyup=calculatePrice('+ i +') >'+'</input>' ;
							//htmlStr = htmlStr + ' <input font="Arial" font-size="14px" id= '+str1+i+' value='+arrayLotNumQty[i]+' style=width:12px onkeyup=calculatePrice('+ i +') >'+'</input>' ;
							htmlStr = htmlStr + "</td>";

							htmlStr = htmlStr + "<td align='right'>";
							htmlStr = htmlStr + ' <img src =./src/css/custom/img/removeButton2.png style="width:20px;height:20px" onclick=rmvLot('+ i +') >'+'</img>' ;
							htmlStr = htmlStr + "</td>";
							
						htmlStr = htmlStr + "</tr>";	
			 
				}
				htmlStr = htmlStr + "</table>";		
				if(arrayLotNumSelected.length>0)
				{
					$(".divShopingCart").show(1000);		
				    document.getElementById('lblTotalItems').innerHTML = arrayLotNumSelected.length + " item(s) in your shopping cart.";
					document.getElementById("lblTotalCost").style.display="block";
					document.getElementById("lblTotalCost").style.color="white";
					
					document.getElementById("lblPostalCost").style.display="block";
					document.getElementById("lblPostalCost").style.color="white";
				}
				else/**length=0**/
				{
					$(".salesWindow").hide(500);	
					$(".firstWindow").show(500);	
				}
				document.getElementById('divShopingCart').innerHTML = htmlStr;
				calculateTotalCost();				
		}
	
	/**
	 * When a lot number is removed from the list erase off the added graphics from the lot
	 */
	function rmvLot(value){
		arrayLotNumSelected.splice(value,1); /* remove the lot number from array and reconstruct the table */
		centralAreaFlagArray.splice(value,1); /* remove the CA flag info also*/
		populateShoppingCart(); // re-construct the shopping cart
		arrayGraphicsAdded[value].hide();
		arrayGraphicsAdded.splice(value,1);
		checkField(document.getElementById("deliveryMode").value);
	}
	
	/**
     *	Check what CIP year selected *
	 */
	 
	function SelCIPYear(value){	
		var cip2014 = document.getElementById("cip2014").checked;
		var CZIP80 = document.getElementById("CZIP80").checked;
		var CZIP58 = document.getElementById("CZIP58").checked;
		
		if (cip2014 == false && CZIP80 == false && CZIP58 == false) {
			var message = "Please select at least one Certified Interpretation Plan year."
			showDialog(message);
			value.checked = true;
			return false;
		}
		else {
			calculateTotalCost ();
		} 
	}
	
	
	/**
	 * Update the price label when quaNtity is changed
	 */
	function calculatePrice(value){
		
		var quantity = document.getElementById("qty"+value).value;	
		arrayLotNumQty[value] = quantity;
			if(quantity==""){document.getElementById("qty"+value).value = 0;
				calculateTotalCost();}
				
			else if(!isNaN(quantity))
			{			   
				var price = quantity * 160.50;
				calculateTotalCost();
			}
			else
			{
				var message = "Please enter a valid quantity";
				showDialog(message);		
				document.getElementById("qty"+value).value = 0;
				calculateTotalCost();
			}
	}
	
	/**
	 * calculatePostage ** from Flex program
	 */
	function checkField(value){
	//alert("checkField");
	  var totalWeight = 0;
	  var Multiplier = 0;	  
	 if(value=="Self")
	 {
		postage_glb=0;
		document.getElementById("lblPostalCost").innerHTML = "";
		ShowHidePostagecharge(false);
	 }
	 else
	 {
	 
		/** start Check what Year Certified Interpretation Plan selected **/		
		var cip2014 = document.getElementById("cip2014").checked;
		var CZIP80 = document.getElementById("CZIP80").checked;
		var CZIP58 = document.getElementById("CZIP58").checked;
		
		if (cip2014 == true){
		   Multiplier = Multiplier + 1;
		}
		if (CZIP80 == true){
		   Multiplier = Multiplier + 1;
		}
		if (CZIP58 == true){
		   Multiplier = Multiplier + 1;
		}		
		/** end Check what Year Certified Interpretation Plan selected **/				
	 	 
		ShowHidePostagecharge(true);
		if(arrayLotNumSelected.length>0)
		{
			for(var i=0;i<arrayLotNumSelected.length;i++)
			{
				totalWeight = totalWeight + document.getElementById("qty"+i).value * 13; 
				if (Multiplier > 0) {
					totalWeight = totalWeight * Multiplier;
				}
			}
		}	
		
		/**console.log("totalWeight = " + totalWeight);**/
		
		if (totalWeight == 0) postageCost = 0;
		else {
		totalWeight += 22; // A3 envelope weight
		if (totalWeight < 40) postageCost = 0.5;                                                                                
		else if (totalWeight < 100) postageCost = 0.8;
		else if (totalWeight < 250) postageCost = 1;
		else if (totalWeight < 500) postageCost = 1.5;
		else if (totalWeight < 1000) postageCost = 2.55;
		else postageCost = 3.35;
		}
		document.getElementById("lblPostalCost").innerHTML =  (postageCost).toFixed(2) ;
		postage_glb = postageCost;
	 }
	}
	
	/** SHOW/HIDE the postage row**/
	function ShowHidePostagecharge (parmadd) {
	    
		if (parmadd===true) {
			//$('#tblTotalShoppingCartCost tr:last-child').show();		
			$('#tblTotalShoppingCartCost tr:nth-child(2)').show();											
		}
		else {
			//$('#tblTotalShoppingCartCost tr:last-child).hide();
			$('#tblTotalShoppingCartCost tr:nth-child(2)').hide();											
		}
	}
	
	/**
	 * Update charges based on delivery mode
	 */
	function calculateTotalCost(){
		//alert("calculateTotalCost");
		var total_amount = 0;
		var Multiplier = 0;
		for(var i=0;i<arrayLotNumSelected.length;i++)
			{
				var quantity = document.getElementById("qty"+i).value;
				total_amount = total_amount + (parseInt(quantity)*160.50);
				//total_amount =  (total_amount).toFixed(2); 
			}
			
		/** start Check what Year Certified Interpretation Plan selected **/		
		var cip2014 = document.getElementById("cip2014").checked;
		var CZIP80 = document.getElementById("CZIP80").checked;
		var CZIP58 = document.getElementById("CZIP58").checked;
		
		if (cip2014 == true){
		   Multiplier = Multiplier + 1;
		}
		if (CZIP80 == true){
		   Multiplier = Multiplier + 1;
		}
		if (CZIP58 == true){
		   Multiplier = Multiplier + 1;
		}		
		/** end Check what Year Certified Interpretation Plan selected **/		
		/** console.log ("total_amount = " + total_amount); **/
		/** console.log ("Multiplier = " + Multiplier); **/
		if (Multiplier > 0) {
			total_amount = total_amount * Multiplier;
		}
						
		document.getElementById("lblTotalCost").innerHTML = (total_amount).toFixed(2) ;
		if(total_amount>1000)
		{
			document.getElementById("lblTotalCost").style.color = "red";			
		}
		else
		{
			//document.getElementById("lblTotalCost").style.color = "#2c3e50";
			document.getElementById("lblTotalCost").style.color = "white"
		}
		checkField(document.getElementById("deliveryMode").value);
		amount_paid_glb = total_amount;
	}
	
	/**
	 * Final check out to payments/validations
	 */
	function finalCheckOut(){
			//alert("finalCheckOut");
			var cip2014 = document.getElementById("cip2014").checked;
			var CZIP80 = document.getElementById("CZIP80").checked;
			var CZIP58 = document.getElementById("CZIP58").checked;
			
			
			if(arrayLotNumSelected.length>0)
			{
				if(amount_paid_glb>1000)
				{
					var message = "Total cost cannot be more than S$ 1000";
					showDialog(message);
				}
				else
				{
				
					if(cip2014==false && CZIP80==false && CZIP58==false)
					{
						var message = "Please select Certified Interpretation Plan year.";
						showDialog(message);
						return false;
					}	
					
					//var agreementchk = document.getElementById("terms").checked;
					var agreementchk = true;/* removed check box in new design */
					if(agreementchk==true)
					{
						//alert("post");
						var url = "http://urasvr10.ura.gov.sg/";
			
						var delivery_mode=document.getElementById("deliveryMode").value;
						var amount_paid;
						var postage;
					
						var plan_id = ""; var plan_no=""; var ts_mk = ""; var lot_no = "";var quantity=""; 
						
						/***** check if Certified Interpretation Plan 2014 selected ****/
						if 	(cip2014) {		
							
							for(var i=0; i<arrayLotNumSelected.length;i++)								
							{								
								if(plan_id !="")
								{
								plan_id = plan_id +"#"+ centralAreaFlagArray[i];										
								}
								else
								{
								plan_id =  centralAreaFlagArray[i];
								}
							
								if(plan_no !="")
								{
									plan_no = plan_no +"#"+ "none";
								}
								else
								{
									plan_no =  "none";
								}	
					
								var str = arrayLotNumSelected[i];
								var res = str.split("-");	
								var Qtyid = "qty"+i;
								var qty = document.getElementById(Qtyid).value; //May26
							
								if(ts_mk !="")
								{
									ts_mk = ts_mk+"#"+res[0];
								}
								else
								{
									ts_mk = res[0];
								}
								if(lot_no !="")
								{
									lot_no = lot_no+"#"+res[1];
								}
								else
								{
									lot_no = res[1];
								}
								if(quantity !="")
								{
									quantity = quantity+"#"+qty;
								}
								else
								{
									quantity = qty;
								}									 
							}
						}
						
						/***** Certified Interpretation Plan 1980  ****/
						if (CZIP80) {
							
							for(var k=0; k<arrayLotNumSelected.length;k++)								
							{								
								if(plan_id !="")
								{
								plan_id = plan_id +"#"+ "CZIP80";										
								}
								else
								{
								plan_id = "CZIP80";
								}
							
								if(plan_no !="")
								{
									plan_no = plan_no +"#"+ "none";
								}
								else
								{
									plan_no =  "none";
								}	
					
								var str2 = arrayLotNumSelected[k];
								var res2 = str2.split("-");	
								var Qtyid2 = "qty"+k;
								var qty2 = document.getElementById(Qtyid2).value; //May26
							
								if(ts_mk !="")
								{
									ts_mk = ts_mk+"#"+res2[0];
								}
								else
								{
									ts_mk = res2[0];
								}
								if(lot_no !="")
								{
									lot_no = lot_no+"#"+res2[1];
								}
								else
								{
									lot_no = res2[1];
								}
								if(quantity !="")
								{
									quantity = quantity+"#"+qty2;
								}
								else
								{
									quantity = qty2;
								}									 
							}								
						
						}
						
						/***** Certified Interpretation Plan 1958  ****/
						if (CZIP58) {
							
							for(var k=0; k<arrayLotNumSelected.length;k++)								
							{								
								if(plan_id !="")
								{
								plan_id = plan_id +"#"+ "CZIP58";										
								}
								else
								{
								plan_id = "CZIP58";
								}
							
								if(plan_no !="")
								{
									plan_no = plan_no +"#"+ "none";
								}
								else
								{
									plan_no =  "none";
								}	
					
								var str2 = arrayLotNumSelected[k];
								var res2 = str2.split("-");	
								var Qtyid2 = "qty"+k;
								var qty2 = document.getElementById(Qtyid2).value; //May26
							
								if(ts_mk !="")
								{
									ts_mk = ts_mk+"#"+res2[0];
								}
								else
								{
									ts_mk = res2[0];
								}
								if(lot_no !="")
								{
									lot_no = lot_no+"#"+res2[1];
								}
								else
								{
									lot_no = res2[1];
								}
								if(quantity !="")
								{
									quantity = quantity+"#"+qty2;
								}
								else
								{
									quantity = qty2;
								}									 
							}																
						}

						
						var d = new Date();
						var time = d.getTime();
	
						data = { 
						 url: url,
						 
						 amount_paid: amount_paid,
						 plan_id: plan_id,
						 ts_mk: ts_mk,
						 lot_no: lot_no,
						 
						 quantity: quantity,								 
						 plan_no: plan_no,
						 delivery_mode: delivery_mode,								 
						 postage: postage ,
						 time : time
						 };
						 
						document.getElementById("AMOUNT_PAID").value = amount_paid_glb;
						document.getElementById("PLAN_ID").value = plan_id;
						document.getElementById("TS_MK").value = ts_mk;
						document.getElementById("LOT_NO").value = lot_no;
					
						document.getElementById("QUANTITY").value = quantity;
						document.getElementById("PLAN_NO").value = plan_no;
						document.getElementById("DELIVERY_MODE").value = delivery_mode;																
						document.getElementById("POSTAGE").value = postage_glb;
						document.getElementById("TIME").value = time;
														
						/** console.log("DELIVERY_MODE : " + document.getElementById("DELIVERY_MODE").value) **/
						/** console.log("POSTAGE : " + document.getElementById("POSTAGE").value)			 **/																	
						/** console.log("DELIVERY_MODE : " + document.getElementById("DELIVERY_MODE").value) **/
						/** console.log("AMOUNT_PAID : " + document.getElementById("AMOUNT_PAID").value)	 **/																									
														
						document.forms["loginForm"].submit(); // post

					}//if(agreementchk==true)
					else
					{
						 var message = "Please check the URA terms and conditions!";
						 showDialog(message);
					}					 					
				}
			}
			else
			{
				var message = "Please select at-least one lot to proceed !";
				showDialog(message);
			}
		}
 
	/**
	 * do custom validations
	 */
	function validate(id){
		var value = id.id;
		var str = "";
		switch(value)
			{
			case "txtpost":
			  str = document.getElementById("txtpost").value;
			  if(isNaN(str))
				{
					document.getElementById("txtpost").value = "";
				}
			  break;
			case "txtphn":
			  str = document.getElementById("txtphn").value;
			  if(isNaN(str))
				{
					document.getElementById("txtphn").value = "";
				}
			  break;
			default:
			   break;
			}
	}

	/**
	 * Download Master Plan
	 */
	 
	 function CloseRightDrawer () {
		var id;
		// check if Buy Plan
		if (buyMasterPlanFlag == 1) {
			id = document.getElementById("idbuyBtn");	
			cipFunctionEnabled(id);
		}
		// check if download Plan
		if (dwnldPlan == 1) {
			var id = document.getElementById("iddwldBtn");	
			dwlndMasterPlan(id);
		}
		if(audeSelect ==1){
		    var id = document.getElementById("idAUDEBtn");	
			enableAUDE(id);  
		}
		
	 }
	 	 
	 function ShowHideRightDrawer () {
		 var rightspace;
		 if (rightdrawerShowFlag == 0) {
			rightspace = 0;						
			$('#divrightDrawerShowHidebtn').animate({
						right : rightspace,					
						display: 'toggle'
			}, "slow");			 			
			$(".rightDrawer").hide("slide", {direction : "right"}, "slow");
			$("#rightDrawerShowHidebtn").attr('class', 'rightDrawerShowHidebtnMax');
			rightdrawerShowFlag = 1;
		 }
		 else {
			rightspace = $('#rightDrawer').width();			
			document.getElementById("divrightDrawerShowHidebtn").style.display="block";
			$('#divrightDrawerShowHidebtn').animate({
						right : rightspace,					
						display: 'toggle'
			}, "slow");			 
			document.getElementById("divrightDrawerShowHidebtn").style.display="block";
			$(".rightDrawer").show("slide", {direction : "right"}, "slow");
			$(".rightDrawer").show("slide", {direction : "right"}, "slow");
			$("#rightDrawerShowHidebtn").attr('class', 'rightDrawerShowHidebtnMin');
			rightdrawerShowFlag = 0;
		 }
	    
	 }
	 	 
	function dwlndMasterPlan(id){	
	        mapLoadEvents() // added by lavanya satuluri 17-sept-2014 watercolor basemap - to destroy the previous map properties
			 audeSelect = 0; // added by lavanya satuluri 1-oct-2014 
	        $("#rightDrawerShowHidebtn").attr('class', 'rightDrawerShowHidebtnMin'); // added by lavanya satuluri 12-sept-2014 to change direction of arrow in right panel
            document.getElementById("divRightPanel_AUDE").style.display="none";	 //added by lavanya satuluri 22-Aug-2014
			document.getElementById("idAUDEBtn").style.backgroundColor="#36393E"; //added by lavanya satuluri 22-Aug-2014
			 
			var rightspace;
			var leftspace = "1%";
			 
		   /** remove all functionalities linked to buy plan **/		   
		   if (buyMasterPlanFlag == 1) {
				map.removeLayer(LandLotMap);
				for(var i=0;i<addedMapsArray.length;i++)
				{
				  if(addedMapsArray[i] == "ollm")
					{
						addedMapsArray.splice(i, 1);						
					}	
										
				}
			}	
		    			
			document.getElementById("idbuyBtn").style.backgroundColor="#36393E"; 
			buyMasterPlanFlag = 0; //switched off			
			flagollm = 0;
			document.getElementById('ollm_sel').style.display="none"; //removing checkicon				
			for(var i=0;i<addedMapsArray.length;i++)
			{
			  if(addedMapsArray[i] == "ollm")
				{
					addedMapsArray.splice(i, 1);						
				}										
			}
			
			/** SetVisibility to false for all added map that previously hide. ***/				
				for (var i = 0; i <= addedMapsArray.length-1; i++) {					  																	
					if(addedMapsArray[i] == "map_mp14"){MP14Map.setVisibility(true);}
					if(addedMapsArray[i] == "map_pwb"){PW14Map.setVisibility(true);}
					if(addedMapsArray[i] == "map_lha"){LHAPMap.setVisibility(true);}
					if(addedMapsArray[i] == "map_sbud"){SBPUMap.setVisibility(true);}
					if(addedMapsArray[i] == "map_bhp"){BHPMap.setVisibility(true);}				
					if(addedMapsArray[i] == "map_agu"){AGUPMap.setVisibility(true);}	
                    if(addedMapsArray[i] == "wcb"){WaterColorMap.setVisibility(true);}		//added by lavanya satuluri 29 Aug 2014 AUDE
					if(addedMapsArray[i] == "iss"){InventorySalesMap.setVisibility(true);}		//added by Bably 23 Oct 2014
			}			
			
			
			if(addedMapsArray.length == 1){	document.getElementById('divOpacity').style.display="none"; }
			populateDrDn(); /* reconstruct the drop down by removing the landlot layer */	
			lotFlag = 0;/*to disable doQuery method*/
			/**move the basemap and opacity combined div accordingly **/			
			 if(isIpad==true) // display splash screen commented for now
			{
				   document.getElementById("divOpacity").style.left="40%" ;
			}
		
			/**clear the selected plan and amount in the sales window  right drawer**/
			$(".salesWindow").hide(500);	
			$(".firstWindow").show(500);					
			document.getElementById('ShopCartTotalitems').style.display="none";
			document.getElementById('lblTotalItems').innerHTML = "";
			document.getElementById('divShopingCart').innerHTML = "";
			document.getElementById('lblTotalCost').innerHTML = "";							
			document.getElementById("lblTotalCost").style.display="none";
			document.getElementById("cip2014").checked = true;
			document.getElementById("CZIP80").checked = false;
			document.getElementById("CZIP58").checked = false;
			arrayLotNumSelected = new Array();
			centralAreaFlagArray = new Array();
			arrayGraphicsAdded = new Array();
			amount_paid_glb = 0;
			postage_glb=0;
			
			/** Show all maps except Land Lot Map **/
			for (var i = 1; i < 9; i++) {	   // changed from 8 to 9 - lavanya satuluri 29 Aug 2014 - AUDE	  					  									
				$('#tblMap tr:nth-child(' + i + ')').show();				
			}
			
			/** Clear graphics **/
			map.graphics.clear();				
			ClearGraphicsLayers ();			
			
			/** remove all functionalities linked to buy plan **/
		
		if(dwnldPlan == 0)
		{  	/** Selected Download Master Plan **/
			/** Hide all maps except "Master Plan Map" **/								
			$('#tblMap tr:nth-child(1)').hide();								
			$('#tblMap tr:nth-child(n+3)').hide();								
			
			
			/** On the left panel, when you click on “Download Plan”,  collapse the left panel **/
			$(".leftDrawer").hide("slide", {direction : "left"}, "slow");
			
			$("#cipText").attr("class", "cipText");
			
			
			leftdrawerShowFlag = 0;
			
			 $('.header').animate({
				position: 'absolute',
				marginLeft: '0px',
				display: 'toggle'
			}, "slow");
					
			$('#map-canvas_zoom_slider').animate({
					left : leftspace,					
					display: 'toggle'
			}, "slow");			 		
			
			if(document.getElementById("search-suggest").style.display == "block"){
				$('.search-suggest').animate({
					position: 'absolute',
					marginLeft: '0px',
					display: 'toggle'
					}, "slow");
			}
				 
			if(isIpad==true) {
				divOpacityLeft = window.innerWidth - $("#rightDrawer").width() - $("#divOpacity").width() - 50 ;
				divOpacityLeft = divOpacityLeft + "px";					
				$('#divOpacity').animate({
					left : divOpacityLeft,					
					display: 'toggle'
				}, "slow");			 
			}
				 
			document.getElementById("salesWindow").style.display="none";
			document.getElementById("firstWindow").style.display="none";
			   
			/** On the left panel, when you click on “Download Plan”,  collapse the left panel **/		
			/** start Min/Max button **/
			rightspace = $('#rightDrawer').width();			
			document.getElementById("divrightDrawerShowHidebtn").style.display="block";
			$('#divrightDrawerShowHidebtn').animate({
						right : rightspace,					
						display: 'toggle'
			}, "slow");			 
			
			$(".rightDrawer").show("slide", {direction : "right"}, "slow");
			document.getElementById("cipText").innerHTML = "Download Master Plan 2014";
			document.getElementById("DownloadWindow").style.display = "block";
						
			document.getElementById("firstWindow").style.display = "none";
			document.getElementById("salesWindow").style.display = "none";
			
			//Switch the current map to MP14
			switchMap('map_mp14',false)
			
			dwnldPlan = 1;
			rightdrawerShowFlag = 0
			document.getElementById(id.id).style.backgroundColor="#272B2E"; //changing button color to show it is selected		
			document.getElementById("SPALabel").innerHTML = "Click on the map to add a planning area.";
			document.getElementById("divSPALabel").style.display = "block";
			
			if(isIpad==true) // display splash screen commented for now
			{   
				document.getElementById("divOpacity").style.left="30%" ;					
			}
			
			
			
			//	switchMap('map_updatedmp',true)
			
									
			queryTask = new esri.tasks.QueryTask(PLANNING_AREA_URL);
			query = new esri.tasks.Query();			
			query.returnGeometry = true;
			query.outSpatialReference = {wkid:3414}; 
			query.where="1=1";
			queryTask.execute(query,getAllPolygons);	
		}
		else
		{   /** unselected Download Master Plan **/
		
			/** Show all maps that previously hide **/	
			$('#tblMap tr:nth-child(1)').show();													
			$('#tblMap tr:nth-child(n+3)').show();			
			$('#tblMap tr:last-child').hide();					
			document.getElementById(id.id).style.backgroundColor="#36393E";
					
			/*** Clear all down master plan functionalities **/
			map.graphics.clear();
			ClearGraphicsLayers ();						
			arrayPlanAreaSelected = new Array();
			document.getElementById("divtblSelectedPA").innerHTML = "";
			document.getElementById('divtbldownloadPAbtn').innerHTML = "";
			document.getElementById("Particularsttxtname").value = "";
			document.getElementById("Particularsrole").value = "";
			document.getElementById("divSelectPA").style.display = "block";
			document.getElementById("NoPLSelDiv").style.display = "block";
			document.getElementById("DivParticulars").style.display = "none";
			document.getElementById("divDownloadPA").style.display = "none";
			document.getElementById("IsWideCbeckbox").checked = false;
			/** hide the rightDrawer **/
			
			/** Min/Max button **/
			rightspace = -28;						
			$('#divrightDrawerShowHidebtn').animate({
						right : rightspace,					
						display: 'toggle'
			}, "slow");			 
			$(".rightDrawer").hide("slide", {direction : "right"}, "slow");	
			document.getElementById("divrightDrawerShowHidebtn").style.display="block";
			
			dwnldPlan = 0;			
			rightdrawerShowFlag = 1;
			
			//Switch the Map to UpdateMP
			switchMap('map_updatedmp',false);
			
		}
		 closeLegend(); //added by lavanya satuluri 15 oct 2014
	}

	function getAllPolygons(featureSet)	{
	 	 var symbol = new esri.symbol.SimpleFillSymbol();
		 //symbol.setColor(new dojo.Color([150,150,150,0.5]));
         symbol.setColor(new dojo.Color([150,150,150,0.0]));
		 dojo.forEach(featureSet.features, function(feature) {
				var graphic = feature;
				feature.setSymbol(symbol); //highlight the polygon
				map.graphics.add(feature);
			}); 	
		
		/** check if there is an existing click even graphics layer **/
		if (connectionsEvent.length > 0) {
			dojo.forEach(connectionsEvent, dojo.disconnect);
			connectionsEvent=[];			 
		}		
		/** Push event handle ***/
		connectionsEvent.push(dojo.connect(map.graphics, "onClick",queryFeatureLayer));
	}
	
	function ClearGraphicsLayers () {
		/** Iterate each graphics layer and clear **/
		//map.graphics.clear();
		dojo.forEach(map.graphicsLayerIds, dojo.hitch(this,function(gLayer,i){
				map.getLayer(gLayer).clear();
		}));
	}
	
	function queryFeatureLayer(evt){			
			var x = evt.mapPoint.x ;
			var y = evt.mapPoint.y ;			
			queryTask = new esri.tasks.QueryTask(PLANNING_AREA_URL);
			query = new esri.tasks.Query();			
			var XY = new esri.geometry.Point (x,y, new esri.SpatialReference({ wkid: 3414 }));
			query.geometry = XY;
			query.outSpatialReference = {wkid:3414}; 			
			query.outFields = ["PLN_AREA_N"];
			query.returnGeometry = true;			
			queryTask.execute(query,getPlanningArea);	
			
	}
		
	function getPlanningArea(featureSet){		
		//if(citylayerflag == 1){map.removeLayer(cityLayer); citylayerflag=0;}				
		var features = featureSet.features;			
		cityLayer = new esri.layers.GraphicsLayer();
	  	//map.addLayer(cityLayer);		
		var flagex = 0;

		var highlightsymbol = new esri.symbol.SimpleFillSymbol();
        highlightsymbol.setColor(new dojo.Color([255, 0, 0,1]));
		
		var polys = new esri.geometry.Polygon();
		
		for (var i=0, il=featureSet.features.length; i<il; i++) 
		{
			var features = featureSet.features;
			//var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255,0.65]), 2), new dojo.Color([0,0,255,0.35]));			
			var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([43,206,95,0.60]), 2), new dojo.Color([43,206,95,0.35]));
			
			var polys = new esri.geometry.Polygon();
			for (var j=0, jl=features.length; j<jl; j++) 
			{
				var featureGeom = features[j].geometry;
				for (var k=0, kl=featureGeom.rings.length; k<kl; k++) 
				{
				  var featureGeomRing = featureGeom.rings[k];
				  polys.addRing(featureGeomRing);
				}
			}
	
			XYGraphic = new esri.Graphic(polys, symbol);
			cityLayer.add(XYGraphic); 	
		}	
		
		XYGraphic = new esri.Graphic(polys, symbol);
		cityLayer.add(XYGraphic); 	
		citylayerflag = 1;
	
		var count = featureSet.features.length;		
		if(count==1){pln_area_name = featureSet.features[0].attributes.PLN_AREA_N;}
		
		//Check for duplicate selected Plan Area
		if(arrayPlanAreaSelected.length > 0) {				
				for(var i=0;i<arrayPlanAreaSelected.length;i++)
					{
					  if(arrayPlanAreaSelected[i] == pln_area_name)
						{
							flagex =  1;					
							break;
						}	
											
					}
		}	
		
		if (flagex == 0) {
			arrayPlanAreaSelected.push(pln_area_name);		
			arrayPlanAreaSelectedLayer.push(cityLayer);		
			map.addLayer(cityLayer);		
			populateSelectedPA ();
		}
		else {
			var message = "Planning area : " + pln_area_name + " is already in list";
			showDialog(message);		
		}
		
	}
	
	function populateSelectedPA() {
		var objDiv = document.getElementById("divtblSelectedPA");
		objDiv.innerHTML = "";
		if (arrayPlanAreaSelected.length > 0) {
			document.getElementById("NoPLSelDiv").style.display = "none";				
		}
		else {			
			document.getElementById("NoPLSelDiv").style.display="block";				
		}
		var htmlStr = "<table id='tblSelectedPA' class='tblSelectedPA' border=0>";		
		for(var i=0;i<arrayPlanAreaSelected.length;i++)//for testing
			{
				 
				htmlStr = htmlStr + "<tr>";
				
					htmlStr = htmlStr + "<td class='tblSelectedPAItem'><span>";
					htmlStr = htmlStr + arrayPlanAreaSelected[i];
					htmlStr = htmlStr + "</span></td>";
					
					htmlStr = htmlStr + "<td class=tblSelectedPAItemRem>";
					htmlStr = htmlStr + ' <img src =./src/css/custom/img/remove.png style="width:15px;height:15px" onclick=rmvPA('+ i +') >'+'</img>' ;
					htmlStr = htmlStr + "</td>";
					
				htmlStr = htmlStr + "</tr>";	
				htmlStr = htmlStr + "<tr><td class='tblSelectedPASpace'></td></tr>";				 
			}
		htmlStr = htmlStr + "</table>";		
		objDiv.innerHTML = htmlStr;			
		objDiv.scrollTop = objDiv.scrollHeight;		
	}
	
	//Remove selected PA when X icon is clicked
	function rmvPA(value) {
		/** remove the selected Plan Area **/
	    map.removeLayer(arrayPlanAreaSelectedLayer[value]);
		arrayPlanAreaSelected.splice(value,1); /* remove the Planning Area from array and reconstruct the table */		
		arrayPlanAreaSelectedLayer.splice(value,1)
		populateSelectedPA(); // re-construct the shopping cart		
	}
		
	function ShowParticulars () {	
		if (arrayPlanAreaSelected.length > 0 || document.getElementById("IsWideCbeckbox").checked == true) {						
			document.getElementById("divSPALabel").style.display="none";	
			document.getElementById("divSelectPA").style.display = "none";	
			document.getElementById("DivParticulars").style.display="block";	
			document.getElementById("divDownloadPA").style.display="none";	
			
			$("#DownloadWindow").addClass('DownloadWindowParticulars');
						
			/** disable click even graphics layer **/
			if (connectionsEvent.length > 0) {
				dojo.forEach(connectionsEvent, dojo.disconnect);
				connectionsEvent=[];			 
			}			
		}
		else {
			var message = "Please select planning area or island-wide Master Plan.";
			showDialog(message);		
		}				
	}
	
	function gobackSelectPA () {		
		document.getElementById("divSPALabel").style.display="block";	
		document.getElementById("SPALabel").innerHTML="Click on the map to add a planning area.";
		document.getElementById("divSelectPA").style.display = "block";			
		document.getElementById("DivParticulars").style.display="none";	
		$("#DownloadWindow").attr('class', 'DownloadWindow');
		/** enable click even graphics layer **/
		connectionsEvent.push(dojo.connect(map.graphics, "onClick",queryFeatureLayer));
		
	}
		
	function ValidateParticulars() {	
		var name = document.getElementById("Particularsttxtname").value;
			
		if (name == "" ) {
			message = "Please enter you name.";
			showDialog(message);
			return false;
		}		
		ShowDownLoadPA();
	
	}	
		
	function ShowDownLoadPA() {
		document.getElementById("divSPALabel").style.display="block";	
		document.getElementById("SPALabel").innerHTML="Click each planning area to view or save as PDF.";
		document.getElementById("DivParticulars").style.display="none";	
		document.getElementById("divDownloadPA").style.display="block";	
		$("#DownloadWindow").attr('class', 'DownloadWindow');
		populatedownloadPAbtn();			
	}
	
	function populatedownloadPAbtn() {
		document.getElementById('divtbldownloadPAbtn').innerHTML = "";
		var downloadPlanArea;
		var htmlStr = "<table id='tbldownloadPAbtn' class='tbldownloadPAbtn' border=0";		
			/** Check if Island-wide is selected **/
			if (document.getElementById("IsWideCbeckbox").checked == true) {
				htmlStr = htmlStr + "<tr>";						 
				htmlStr = htmlStr + "<td class='tbldownloadPAbtnContent'>";							
				htmlStr = htmlStr + "<button type='button' class='btnPADownload'  onClick='downloadIsWide()' >ISLAND-WIDE MASTER PLAN</button>"
				htmlStr = htmlStr + "</td>";
																				
				htmlStr = htmlStr + "</tr>";	
				htmlStr = htmlStr + "<tr><td class='tbldownloadPAbtnSpace'></td></tr>";	
				document.getElementById('divtbldownloadPAbtn').innerHTML = htmlStr;		
			
			}
			/** populate selected Plan Area **/
			for(var i=0;i<arrayPlanAreaSelected.length;i++)//for testing
				{
						downloadPlanArea = "downloadPA('temp')" ;
						downloadPlanArea = "downloadPA('" +arrayPlanAreaSelected[i]+ "')";
						downloadPlanArea = '"' +  downloadPlanArea + '"';
					
						htmlStr = htmlStr + "<tr>";						 
							htmlStr = htmlStr + "<td class='tbldownloadPAbtnContent'>";							
							htmlStr = htmlStr + "<button type='button' class='btnPADownload'  onClick=" + downloadPlanArea + ">" +  arrayPlanAreaSelected[i] + "</button>"
							htmlStr = htmlStr + "</td>";
																						
						htmlStr = htmlStr + "</tr>";	
						htmlStr = htmlStr + "<tr><td class='tbldownloadPAbtnSpace'></td></tr>";	
			 
				}
				htmlStr = htmlStr + "</table>";		
		document.getElementById('divtbldownloadPAbtn').innerHTML = htmlStr;		
	}
	
	function gobackParticulars() {
		document.getElementById("divSPALabel").style.display="none";	
		document.getElementById("divDownloadPA").style.display="none";
		document.getElementById("DivParticulars").style.display="block";	
		$("#DownloadWindow").addClass('DownloadWindowParticulars');
	}
	
	
	/** download Planning Area **/
	function downloadPA(pan){	
		//For planid, MP14PA_D is passed in for planning area downloads, and MP14IS_D is passed in for Islandwide download.
		//Hard coded for now
		var pln_id   = "MP14PA_D" ; 		
		var appName	 =	document.getElementById("Particularsttxtname").value
		var roleType =	document.getElementById("Particularsrole").value
		
		document.getElementById("applName").value = appName;
		document.getElementById("applRoleType").value = roleType;		
		document.getElementById("planid").value = "MP14PA_D";
		document.getElementById("planningarea").value = pan;		
		document.forms["downloadMPForm"].submit(); // post							
	}
	
	/** download Planning Area **/
	function downloadIsWide(){				
		var pln_id   = "MP14IS_D" ; 		
		var pln_area_name   = "MP14IS_D"; 
		var appName	 =	document.getElementById("Particularsttxtname").value
		var roleType =	document.getElementById("Particularsrole").value

		document.getElementById("applName").value = appName;
		document.getElementById("applRoleType").value = roleType;		
		document.getElementById("planid").value = pln_id;
		document.getElementById("planningarea").value = pln_area_name;
		
		document.forms["downloadMPForm"].submit(); // post	
	}
	
	
	//start lavanya - integration AUDE 20-Aug-2014
	
	function enableAUDEIntegr(id){	
            var rightspace;
			var leftspace = "1%";
		   /** remove all functionalities linked to buy plan **/		   
		   if (buyMasterPlanFlag == 1) {
				map.removeLayer(LandLotMap);
				for(var i=0;i<addedMapsArray.length;i++)
				{
				  if(addedMapsArray[i] == "ollm")
					{
						addedMapsArray.splice(i, 1);						
					}										
				}
			}	    			
			document.getElementById("idbuyBtn").style.backgroundColor="#36393E"; 
			buyMasterPlanFlag = 0; //switched off			
			flagollm = 0;
			document.getElementById('ollm_sel').style.display="none"; //removing checkicon				
			for(var i=0;i<addedMapsArray.length;i++)
			{
			  if(addedMapsArray[i] == "ollm")
				{
					addedMapsArray.splice(i, 1);						
				}										
			}
			
			/** SetVisibility to false for all added map that previously hide. ***/				
				for (var i = 0; i <= addedMapsArray.length-1; i++) {					  																	
					if(addedMapsArray[i] == "map_mp14"){MP14Map.setVisibility(true);}
					if(addedMapsArray[i] == "map_pwb"){PW14Map.setVisibility(true);}
					if(addedMapsArray[i] == "map_lha"){LHAPMap.setVisibility(true);}
					if(addedMapsArray[i] == "map_sbud"){SBPUMap.setVisibility(true);}
					if(addedMapsArray[i] == "map_bhp"){BHPMap.setVisibility(true);}				
					if(addedMapsArray[i] == "map_agu"){AGUPMap.setVisibility(true);}	
                    if(addedMapsArray[i] == "wcb"){WaterColorMap.setVisibility(true);}		//added by lavanya satuluri 29 Aug 2014 AUDE
					if(addedMapsArray[i] == "iss"){InventorySalesMap.setVisibility(true);}		//added by Bably 23 Oct 2014
			}			
				
			if(addedMapsArray.length == 1){	document.getElementById('divOpacity').style.display="none"; }
			populateDrDn(); /* reconstruct the drop down by removing the landlot layer */	
			lotFlag = 0;/*to disable doQuery method*/
			/**move the basemap and opacity combined div accordingly **/			
			 if(isIpad==true) // display splash screen commented for now
			{
				   document.getElementById("divOpacity").style.left="40%" ;
			}
		
			/**clear the selected plan and amount in the sales window right drawer**/
			$(".salesWindow").hide(500);	
			$(".firstWindow").show(500);					
			document.getElementById('ShopCartTotalitems').style.display="none";
			document.getElementById('lblTotalItems').innerHTML = "";
			document.getElementById('divShopingCart').innerHTML = "";
			document.getElementById('lblTotalCost').innerHTML = "";							
			document.getElementById("lblTotalCost").style.display="none";
			document.getElementById("cip2014").checked = true;
			document.getElementById("CZIP80").checked = false;
			document.getElementById("CZIP58").checked = false;
			arrayLotNumSelected = new Array();
			centralAreaFlagArray = new Array();
			arrayGraphicsAdded = new Array();
			amount_paid_glb = 0;
			postage_glb=0;
			
			// /** Show all maps except Land Lot Map **/ commented by lavanya 20-Aug-2014
			// for (var i = 1; i < 8; i++) {					  									
				// $('#tblMap tr:nth-child(' + i + ')').show();				
			// }
			
			// /** hide all maps **/ added by lavanya 20-Aug-2014
			 for (var i = 1; i < 9; i++) {					  									
				 $('#tblMap tr:nth-child(' + i + ')').hide();				
			 }
			
			/** Clear graphics **/
			map.graphics.clear();				
			ClearGraphicsLayers ();			
			
			/** remove all functionalities linked to buy plan **/
			
			
			
			/*** Clear all down master plan functionalities **/
		document.getElementById("iddwldBtn").style.backgroundColor="#36393E";							
		map.graphics.clear();
		ClearGraphicsLayers ();						
		arrayPlanAreaSelected = new Array();
		document.getElementById("divtblSelectedPA").innerHTML = "";
		document.getElementById('divtbldownloadPAbtn').innerHTML = "";
		document.getElementById("Particularsttxtname").value = "";
		document.getElementById("Particularsrole").value = "";
		document.getElementById("divSelectPA").style.display = "block";
		document.getElementById("NoPLSelDiv").style.display = "block";
		document.getElementById("DivParticulars").style.display = "none";
		document.getElementById("divDownloadPA").style.display = "none";
		document.getElementById("IsWideCbeckbox").checked = false;
		/** hide the rightDrawer **/
						
		//map.graphics.clear();
		/** Clear graphics **/
		//ClearGraphicsLayers ();
	
		dwnldPlan = 0;
		leftdrawerShowFlag = 0;
		
		closeLeftPanel();
		if (citylayerflag == 1)
			{ 
					if(citylayerflag == 1){map.removeLayer(cityLayer); citylayerflag=0;}	
			}
			document.getElementById("divSPALabel").style.display = "none";
			document.getElementById("divSPALabel").style.display = "block";
						
			/** Show all maps except lA**/
			for (var i = 1; i < 9; i++) {					  									
					$('#tblMap tr:nth-child(' + i + ')').show();				
			}
			var value = id.id;
			document.getElementById(id.id).style.backgroundColor="#272B2E"; //changing button color to show it is selected
		
		//open the right panel
		$(".rightDrawer").show("slide", {direction : "right"}, "slow");		
		document.getElementById("divSPALabel").style.display = "none";
		document.getElementById("SPALabel").innerHTML = "";
		document.getElementById("cipText").innerHTML = "Award-Winning Buildings"; //added by lavanya satuluri 20-Aug-2014
		// document.getElementById("divRightDrawerHeaderText").innerHTML = "Award-Winning Buildings"; //commented by lavanya satuluri 20-Aug-2014
		document.getElementById("DownloadWindow").style.display = "none"; //added by lavanya satuluri 20-Aug-2014
		$("#cipText").addClass('cipTextBP');
		/** Min/Max Button **/
				rightspace = $('#rightDrawer').width();
				document.getElementById("divrightDrawerShowHidebtn").style.display="block";
				$('#divrightDrawerShowHidebtn').animate({
						right : rightspace,					
						display: 'toggle'
				}, "slow");	
		
		//set AUDE contents to visible
		document.getElementById("divRightPanel_AUDE").style.display="block";
		
		//switch basemap to street map
		switchMap('osm',false);
		
		//Switch to Stamen watercolor base
		/*
		var watercolor_layer = new esri.layers.WebTileLayer('http://${0}.stamen.com/watercolor/${1}/${2}/${3}.jpg', {
					id: 'wtr' + '0',
					visible: true, 
					tileServers: ["a.tile", "b.tile", "c.tile"]
				});
	
		//map.addLayer(watercolor_layer);
		*/
		
		queryAUDEPoints();
		
/*		
		//Get distinct designers
		queryTask2 = new esri.tasks.QueryTask(AUDE_URL);
		query = new esri.tasks.Query();			
		query.returnGeometry = false;		
		query.where="1=1";
		query.outFields = ["designer"];
		query.returnDistinctValues = true;
		query.orderByFields= ["designer"];
		queryTask2.execute(query,getDistinctDesignerResults);
*/		
		//Show "Loading" image
		loadingImg(1, "");
}
	
	
		