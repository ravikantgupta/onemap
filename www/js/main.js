	/**
	 * Copyright @ URA 
	 * Main.js is the overall framework. It house the common functionalities
	 */

	//Variables for URA URLs
	
	/*Master Plan 2014*/	
	var UpdatedMP_URL = "https://www.ura.gov.sg/ArcGis/rest/services/ppg/Updated_Gaz_MP14_Land_Use/MapServer";	//added for ipad lavanya satuluri 23 sept 2014
	
	/*Master Plan 2014*/
	
	var MP14_URL = "https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_Land_Use_gaz/MapServer";
	
	/*Parks and Waterbodies Plan 2014*/
	var PW14Map_URL = "https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_PW_gaz/MapServer";
	
	/*Landed Housing Areas Plan 2014*/
    var LHAPMap_URL = "https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_LHA_gaz/MapServer";
	
	/*Building Height Plan 2014*/
	var BHPMap_URL = "https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_BLDG_HT_gaz/MapServer";	
	
	/*Activity Generating Uses Plan 2014*/
	var AGUPMap_URL = "https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_AGU_gaz/MapServer";
	
	/*Street Block Plan, Urban Design Area, Conservation Areas & Monuments Plan 2014*/
	var SBPUMap_URL = "https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_SBUD_gaz/MapServer";
	
	var ONEMAP_BASEMAP_URL = "https://www.onemap.sg/ArcGIS/rest/services/BASEMAP/MapServer";
	
	var ONEMAP_LOTVIEW_URL = "https://www.onemap.sg/ArcGIS/rest/services/LOT_VIEW/MapServer";
	
	var STBK_LAYER_URL ="https://www.ura.gov.sg/ArcGis/rest/services/ppg/DMP13_DESN_UD_exh/MapServer";
	
	/*Water color basemap url for aude - lavanya satuluri 29 Aug 2014 */
	//var WATERCOLORMap_URL = 'https://${subDomain}.tile.stamen.com/watercolor/${level}/${col}/${row}.jpg';
	var WATERCOLORMap_URL = 'https://stamen-tiles-{subDomain}.a.ssl.fastly.net/watercolor/${level}/${col}/${row}.jpg';
	
	/*Inventory Sales Site URL added by Bably 23 Oct 2014 */  //commented by lavanya satuluri 3 nov 2014 for integration
	// var Inventory_Sales_URL = 'http://wuat.ura.gov.sg/arcgis/rest/services/lsag/GLS_5YR_POINT/MapServer';
	
	
	/** SBU Graphics Layer URL **/
	var BH_BOTANIC_LAYER_URL;
	var DESN_UD_LAYER_URL;
	var STREET_BLOCK_LAYER_URL;	
	
	var botanicLayer; 
	var DESN_UDLayer;			
	var SBLayer;
	var SUB_DESN_UD_heighlighted_GLayer; //added by willy 25-sept-2014
	
	var connectionsEvent = []
	
	//One map variables
	
	var ONEMAP_API_URL = 'https://www.onemap.sg/API/services.svc/';	
	var ONEMAP_ADDRESS_SEARCH_URL = ONEMAP_API_URL + 'basicSearch?token='+ONEMAP_TOKEN;	 //BASIC SEARCH URL	
	var ONEMAP_TOKEN = 'rVV4jR8mJ9EkR4lv+w5rO8ZvBEixc5KfOwjQ8YnqEjvD6uX6E/5UBe4663d6dvWgQgb/KYARJFdGEHT3fyTzE4sqhg6FyeYOHJihKNlOxK2jd4q1qpcsFA==|mv73ZvjFcSo=';//default global onemap token
	var ACCESSKEY;	
	
	//Other global variables
    var map, queryTask, query;
	var scalebar; 
	var initialExtent;
	var GEOMETRYSERVICE_URL,GEOMETRY_SVC; 
	var htmlStr = "";
	var _globalSearch="";
	var marker = ""; // getlocation 
	
	var leftdrawerShowFlag = 0; // to keep track of left drawer status

	var _sgPlanBoun;
	var isIpad = navigator.userAgent.match(/iPad/i) != null; // splash screen 
	var LandLotMap;
	var highlightClickedGraphic;
	
	var MobMenuFlag = 0;
	var IsMobile;
	
	var audeSelect = 0; // added by lavanya satuluri 18 - sept - 2014 watercolor BM search zoom 
	//var RecaptchaOptions = {theme : 'custom', custom_theme_widget: 'recaptcha_widget'};

	var  graphicsLayer_AUDE; //added by lavanya satuluri 26 sept 2014
	
	var  inventoryGraphicLayer; //added by Bably 23 Oct 2014
  //  var txtSearch = 0; //added by lavanya 1-oct-2014
//	var clearSearchGraphic = 0; //added by lavanya 1-oct-2014
	
	/**
	 * init function which is executed on page load
	 */
	
	function init(){	
			/********* splash screen **************/
			document.getElementById('header').style.display="block";  
			//document.getElementById("basemapIcon").style.display="block";  			
			
			if(isIpad==true) // display splash screen commented for now
			{
				//document.getElementById('splashscreen').style.display="block"; 
				//$('#splashscreen').hide(5000);
			}
			/********* splash screen **************/
			getOneMapToken();
			GEOMETRY_SVC = new esri.tasks.GeometryService(GEOMETRYSERVICE_URL);			
			
			/** Check for the protocol is https or http **/ 
			/* commented by lavanya satuluri 30 0ct 2014
			// if(window.location.protocol == 'https:') {						   			  
			   // ONEMAP_API_URL1 = "https://www.onemap.sg/SystemServices/Services.svc/";  	
			// }
			// else {			   
			   // ONEMAP_API_URL1 = "http://www.onemap.sg/SystemServices/Services.svc/";  
			// }
			// ONEMAP_LOT_SEARCH_URL = ONEMAP_API_URL1 + 'querytask?token='+ONEMAP_LOT_TOKEN;	
             /* end comment by lavanya satuluri 30 0ct 2014						

						
			/** check for the parameter **/			
									
			map = new esri.Map("map-canvas", {
			  logo:false,
			});    		
				
          scalebar = new esri.dijit.Scalebar({
          map: map,
          // "dual" displays both miles and kilmometers
          // "english" is the default, which displays miles
          // use "metric" for kilometers
          scalebarUnit: "dual",
          attachTo : "bottom-right"
        });				
			//dojo.connect(map,"onExtentChange", checkLodLevel); // Limit URA maps to get zoomed beyond level 6
			UpdatedMPMap = new esri.layers.ArcGISTiledMapServiceLayer(UpdatedMP_URL);
			MP14Map = new esri.layers.ArcGISTiledMapServiceLayer(MP14_URL);			
			PW14Map = new esri.layers.ArcGISTiledMapServiceLayer(PW14Map_URL);		
			LHAPMap = new esri.layers.ArcGISTiledMapServiceLayer(LHAPMap_URL);
			BHPMap = new esri.layers.ArcGISTiledMapServiceLayer(BHPMap_URL);
			AGUPMap = new esri.layers.ArcGISTiledMapServiceLayer(AGUPMap_URL);
			SBPUMap = new esri.layers.ArcGISTiledMapServiceLayer(SBPUMap_URL);
			StreetMap = new esri.layers.ArcGISTiledMapServiceLayer(ONEMAP_BASEMAP_URL);
			LandLotMap = new esri.layers.ArcGISTiledMapServiceLayer(ONEMAP_LOTVIEW_URL);
            WaterColorMap = new esri.layers.WebTiledLayer(WATERCOLORMap_URL,{"id": "WaterColor Map","subDomains": ["a", "b", "c","d"]}); // added by lavanya satuluri 29 Aug 2014 
			// InventorySalesMap = new esri.layers.ArcGISDynamicMapServiceLayer(Inventory_Sales_URL, {
								// "id": "InventorySalesMap",
								// "opacity" : 0.5						  
								  // }); /* added by Bably 23 Oct 2014 */
			
			
			
			map.addLayer(UpdatedMPMap);
			map._params.maxZoom = 3;
			
			loadingImg(0, "");
			 
			dojo.connect(map, "onMouseOver", function(evt){})
			dojo.connect(map, "onClick", doQuery);				
			dojo.connect(map, 'onLoad',  Winload);
			
			document.getElementById("txtSelectedMap").innerHTML = "You are viewing: <font style='font-weight:bold;'>   Master Plan (approved amendments incorporated)";
			
			/*
			setTimeout(function () {
			        setMapExtent(map) //centralise the MP map on first load
			}, 1000);
			*/
			
			/**clear all graphics on the map when the info window is closed **/
			/*dojo.connect(map.infoWindow._hide, "onclick", function(){
					map.graphics.clear();
				});*/		
		}	
			
        //created by lavanya satuluri 17-sept-2014 for Watercolor BM code - destroying basemap 
        function mapLoadEvents(){
            map.destroy();
			map = new esri.Map("map-canvas", {
			  logo:false,
			});
			map.addLayer(UpdatedMPMap);
			map._params.maxZoom = 6;
			dojo.connect(map, "onClick", doQuery);			
}		

        //end by lavanya satuluri 17-sept-2014 for Watercolor BM code - destroying basemap 


			
		function getUrlParameter(sParam)
		{									
			/** check for the parameter **/			
			var sPageURL = window.location.search.substring(1);
			var sURLVariables = sPageURL.split('&');
			for (var i = 0; i < sURLVariables.length; i++) 
			{
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] == sParam) 
				{
					return sParameterName[1];
				}
			}
		}
		
								
		function Winload() {
			var service_parm = "";
			var id;
			var service_parm = getUrlParameter('service');
			
			console.log ("service_parm=" + service_parm);
			
			/** check if mobile **/
			if (IsMobile == false) {				
				if (typeof service_parm === "undefined") {
					openSideBar();			
				}					
				else if (service_parm.toUpperCase().trim() == 'MP2014_CIP') {
					id = document.getElementById("idbuyBtn");						
					cipFunctionEnabled(id);
				}	
				else if (service_parm.toUpperCase() == 'MP2014_DL') {			
					id = document.getElementById("iddwldBtn");	
					dwlndMasterPlan(id);			
				}				
				else if (service_parm.toUpperCase() == 'PWB') {								
					switchMap('map_pwb',true);					
				}				
				else if (service_parm.toUpperCase() == 'LHA') {			
					switchMap('map_lha',true);
				}				
				else if (service_parm.toUpperCase() == 'BH') {			
					switchMap('map_bhp',true);
				}								
				else if (service_parm.toUpperCase() == 'AGU') {			
					switchMap('map_agu',true);
				}								
				else if (service_parm.toUpperCase() == 'SBUD') {			
					switchMap('map_sbud',true);					
				}	
				//added by lavanya satuluri 29 Aug 2014 
                else if (service_parm.toUpperCase() == 'WCB') {			
					id = document.getElementById("idAUDEBtn");	
                    enableAUDE(id);				
				}	
                //end lavanya satuluri 29 Aug 2014	
				
				
				//added by Bably 23 oct 2014
                else if (service_parm.toUpperCase() == 'ISS') {			
					 id = document.getElementById("divInventorySales");	
                    enableInventorySales(id);	
								
				}	
                //end Bably 23 oct 2014

//lavanya satuluri AUDE 
                // else if (service_parm.touppercase() == 'aude') {			
					 // id = document.getelementbyid("idaudebtn");	
                      // enableaude(id);				
				  // }	
			//lavanya satuluri AUDE building search	 
			else if (service_parm.toUpperCase() == 'AUDE'){	 // corrected by lvanya satuluri 2-oct-2014
				 $.ajax({
				    url: ONEMAP_API_URL + 'getToken?accessKEY=' + ACCESSKEY,
					type : 'GET',
					crossDomain : true,
					dataType : 'jsonp',
					success : function(data) {
						var temp = data.GetToken[0];
						if (temp.NewToken){
							ONEMAP_TOKEN = temp.NewToken;
							ONEMAP_ADDRESS_SEARCH_URL = ONEMAP_API_URL + 'basicSearch?token='+ONEMAP_TOKEN;	
							var buildingID = "";				 
					id = document.getElementById("idAUDEBtn");	
                    enableAUDE(id);
					var sPageURL = window.location.search.substring(1);
			        var sURLVariables = sPageURL.split('&');
					for (var i = 0; i < sURLVariables.length; i++) 
					{
						var sParameterName = sURLVariables[i].split('=');
						if (sParameterName[0] == "BUILDINGID") 
						{
							buildingID =  sParameterName[1];
						}
					} 
					 $('#txtSearchText').val(buildingID);
					 $('.search-input').val(buildingID);
					 var whereclause ="";
					 if (buildingID === "") {
			                whereclause = "1=1";  
		             }
					 else{
				     whereclause = "SEARCHVAL LIKE '"+buildingID+"'"; // added by lavanya satuluri 26-Aug-2014 
					 }
					 $.ajax({
							url: ONEMAP_ADDRESS_SEARCH_URL + '&wc='+whereclause+'&returnGeom=1&rset=1',
							type : 'GET',
							crossDomain : true,
							dataType : 'jsonp',
							success : function(data) 
							{
								var outPutResults = new Object;
								outPutResults.nop = data.SearchResults[0].PageCount;
								outPutResults.results = data.SearchResults.splice(1, data.SearchResults.length);
								results = outPutResults.results;
								if (outPutResults.results.length === 0) 
								{
									// outPutResults.results = 'NR'; 
									// var htmlStr = "<table width='100%'><tr><td>";
									// htmlStr = htmlStr + "<th><font color='red'>NO RESULTS FOUND</font></th>";
									// htmlStr = htmlStr + "</table>";
									// document.getElementById('divResults').style.height="35px";
									// document.getElementById('divResults').style.width="317px";
									// document.getElementById('divResults').innerHTML = htmlStr;
									document.getElementById('search-suggest').style.display = "block";
								}
								else{
								zoomSearchAddressTo(outPutResults.results[0].X,outPutResults.results[0].Y,0);
								console.log("User selected: ", buildingID);	
								$('#infoFrame').attr('src', path + "?bldgid=" + buildingID)
		                        $("#dialog").dialog("open");
								
								  // $(".idbuyBtn").hide();
				                 // $(".iddwldBtn").hide();
								
								}
								 //displayData(outPutResults);
								
							},
							error : function() { 
								alert('Error in Onemap search address.');
							}
						});	
							
						}
						else {
							alert('Onemap API access is denied.');
						}
					},
					error : function() { 
						    alert('Onemap API access is denied.');
					}
		        });
                    
				 }	
//end lavanya satuluri				
				else {
					openSideBar();			
				}				
			}			
		}		
			
		/*	
		function checkLodLevel(extent, delta, outLevelChange, outLod){
		
			var a = addedMapsArray.indexOf("osm");
			var b = addedMapsArray.indexOf("ollm");
			
			if(a == -1 && b == -1) // if none of one maps are added limit zoom level to 6
			{
				level = outLod.level ; 
				console.log ("level = " + level);							
				if (level >= 6)
				{													
					//var message = "Map cannot bet zoomed beyond Level 6";
					//showDialog(message);
					//map.setLevel(6); // resetting level back to 6				
				}
				else {
					//$(".esriSimpleSliderIncrementButton esriSimpleSliderDisabledButton").attr("esriSimpleSliderIncrementButton");
				}
			}
			
		}
		*/
		
	/**
	 * Get OneMap token checking current host url
	 */
	

// function abcd(result){
// console.log(result +  'gvhvfhvg ');
// }	
	 
	 
	 
	function getOneMapToken()	{
		var currentURL = document.URL;
		//indexOf method returns -1 if substring not found
		if(currentURL.indexOf('127.0.0.1') >= 0  || currentURL.indexOf('localhost') >= 0) 
		{
			ACCESSKEY = 'rVV4jR8mJ9EkR4lv+w5rO8ZvBEixc5KfOwjQ8YnqEjvD6uX6E/5UBe4663d6dvWgQgb/KYARJFdGEHT3fyTzE4sqhg6FyeYOHJihKNlOxK2jd4q1qpcsFA==|mv73ZvjFcSo=';
			DEV_REG_WEBSERVICE_URL = "http://urasvr10.ura.gov.sg/dcd/eDevtRegister/index.cfm";			
			DEV_REG_DECISION_NOTICE_URL = "https://www.ura.gov.sg/eDevtRegister/eService/digitalDecisionNotice.do";
			DEV_REG_GET_DECISION_NOTICE_URL = "http://urasvr10.ura.gov.sg/dcd/eDevtRegister/getDevtRegByDecisionNo.cfm";
			DEV_REG_GET_DECISION_NOs_URL = "http://urasvr10.ura.gov.sg/dcd/eDevtRegister/getDecisionByDecisionNo.cfm";
			LAYER_URL ='https://wuat.ura.gov.sg/arcgis/rest/services/dcg/plcm/MapServer';
			GEOMETRYSERVICE_URL = 'https://www.ura.gov.sg/ArcGis/rest/services/Utilities/Geometry/GeometryServer';
		} 
		else if(currentURL.indexOf('urasvr10') >=0  )
		{
			ACCESSKEY = 'rVV4jR8mJ9EkR4lv+w5rO8ZvBEixc5KfOwjQ8YnqEjvD6uX6E/5UBe4663d6dvWgQgb/KYARJFdGEHT3fyTzE4sqhg6FyeYOHJihKNlOxK2jd4q1qpcsFA==|mv73ZvjFcSo=';
			DEV_REG_WEBSERVICE_URL = "https://urasvr10.ura.gov.sg/dcd/eDevtRegister/index.cfm";			
			DEV_REG_DECISION_NOTICE_URL = "https://www.ura.gov.sg/eDevtRegister/eService/digitalDecisionNotice.do";
			DEV_REG_GET_DECISION_NOTICE_URL = "https://urasvr10.ura.gov.sg/dcd/eDevtRegister/getDevtRegByDecisionNo.cfm";
			DEV_REG_GET_DECISION_NOs_URL = "https://urasvr10.ura.gov.sg/dcd/eDevtRegister/getDecisionByDecisionNo.cfm";
			LAYER_URL ='https://wuat.ura.gov.sg/arcgis/rest/services/dcg/plcm/MapServer';
			GEOMETRYSERVICE_URL = 'https://wuat.ura.gov.sg/ArcGis/rest/services/Utilities/Geometry/GeometryServer';
		} 
		/* UAT	*/
		else if (currentURL.indexOf('wuat.ura.gov.sg') >= 0) 
		{
			ACCESSKEY = 'rVV4jR8mJ9EkR4lv+w5rO8ZvBEixc5KfOwjQ8YnqEjvD6uX6E/5UBe4663d6dvWgQgb/KYARJFdGEHT3fyTzE4sqhg6FyeYOHJihKNlOxK2jd4q1qpcsFA==|mv73ZvjFcSo=';
			DEV_REG_WEBSERVICE_URL = "https://wuat.ura.gov.sg/eDevtRegister/map/service/getDevtRegAction.do";
			DEV_REG_DECISION_NOTICE_URL = "https://wuat.ura.gov.sg/eDevtRegister/eService/digitalDecisionNotice.do";
			DEV_REG_GET_DECISION_NOTICE_URL = "https://wuat.ura.gov.sg/eDevtRegister/map/service/getDevtRegByDecisionNoAction.do";
			DEV_REG_GET_DECISION_NOs_URL = "https://wuat.ura.gov.sg/eDevtRegister/map/service/getDecisionsByDecisionNoAction.do";
			LAYER_URL ='https://wuat.ura.gov.sg/arcgis/rest/services/dcg/plcm/MapServer';
			GEOMETRYSERVICE_URL = 'https://wuat.ura.gov.sg/ArcGis/rest/services/Utilities/Geometry/GeometryServer';
		} 
		/* LIVE	*/
		else if (currentURL.indexOf('www.ura.gov.sg') >= 0) 
		{
			ACCESSKEY = 'rVV4jR8mJ9EkR4lv+w5rO8ZvBEixc5KfOwjQ8YnqEjvD6uX6E/5UBe4663d6dvWgQgb/KYARJFdGEHT3fyTzE4sqhg6FyeYOHJihKNlOxK2jd4q1qpcsFA==|mv73ZvjFcSo=';
			DEV_REG_WEBSERVICE_URL = "https://www.ura.gov.sg/eDevtRegister/map/service/getDevtRegAction.do";
			DEV_REG_DECISION_NOTICE_URL = "https://www.ura.gov.sg/eDevtRegister/eService/digitalDecisionNotice.do";
			DEV_REG_GET_DECISION_NOTICE_URL = "https://www.ura.gov.sg/eDevtRegister/map/service/getDevtRegByDecisionNoAction.do";
			DEV_REG_GET_DECISION_NOs_URL = "https://www.ura.gov.sg/eDevtRegister/map/service/getDecisionsByDecisionNoAction.do";
			LAYER_URL ='https://www.ura.gov.sg/arcgis/rest/services/dcg/plcm/MapServer';
			GEOMETRYSERVICE_URL = 'https://www.ura.gov.sg/ArcGis/rest/services/Utilities/Geometry/GeometryServer';
		} 		
		$.ajax({
	       url: 'https://www.onemap.sg/API/services.svc/getToken?accessKEY=rVV4jR8mJ9EkR4lv+w5rO8ZvBEixc5KfOwjQ8YnqEjvD6uX6E/5UBe4663d6dvWgQgb/KYARJFdGEHT3fyTzE4sqhg6FyeYOHJihKNlOxK2jd4q1qpcsFA==|mv73ZvjFcSo=',
			type : 'GET',
			crossDomain : true,
			dataType : 'jsonp',
			success : function(data) {
				var temp = data.GetToken[0];
				if (temp.NewToken){
					ONEMAP_TOKEN = temp.NewToken;
					ONEMAP_ADDRESS_SEARCH_URL = ONEMAP_API_URL + 'basicSearch?token='+ONEMAP_TOKEN;	
				}
				else {
					alert('Onemap API access is denied.');
				}
			},
			error : function() { 
				  alert('Onemap API access is denied.');
			}
		});
	}
	
	
	 /**
	 * Centralise the MP map on first load
	 */
	function setMapExtent(_map) {
        	initialExtent = new esri.geometry.Extent(3300.13116927768,16952.53823800802,52219.951675585355,52457.62671485164,
          	_map.spatialReference);  			
			_map.setExtent(initialExtent);
    	}
	
	/**
	 * To show & hide the loading image
	 */
	function loadingImg(value, textdisplay) {
		
		if (textdisplay == "") {
			$('.loadingImgTxt').text("Loading...");
		}	
		else {
			$('.loadingImgTxt').text(textdisplay);
		}
		

		if(value==1)
		{
			$('.loadingImg-element').show();
		}
		else if(value==0)
		{
			$('.loadingImg-element').hide();
		}
	}
	 
	
	/**
	 * To switch the map when button is clicked - enable slider also
	 */
	 var addedMapsArray = new Array();
	 addedMapsArray.push("map_updatedmp");
	 var index = "";
	 var flagmp =0; var flagupdatedmp = 1;
	 var flagpw =0;var flaglh =0;
	 var flagbh =0;var flagagu =0;var flagsbud =0;
	 var flagosm =0;var flagollm =0;
	 var flagwcb = 0; // added by lavanya satuluri 29 Aug 2014
	 var flagiss = 0; // added by Bably 23 oct 2014
	
	function switchMap(currentMap, closeDialog)	{
	
		//Check if Download Plan is selected
		if (dwnldPlan == 1 && currentMap == "map_mp14") return false;
		
		if (lotFlag != 1) {
			map.graphics.clear();
			ClearGraphicsLayers ();			
		}
		
		/* ---------- Remove checkboxes ---------------- */
		if (currentMap != "map_updatedmp" && flagupdatedmp==1) {		
			map.removeLayer(UpdatedMPMap);
			flagupdatedmp = 0;
			//document.getElementById('map_updatedmp_sel').style.display="none"; //removing checkicon
			$('.map_updatedmp_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("map_updatedmp");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		}
		else if (currentMap != "map_mp14" && flagmp==1) {		
			map.removeLayer(MP14Map);
			flagmp = 0;
			//document.getElementById('map_mp14_sel').style.display="none"; //removing checkicon
			$('.map_mp14_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("map_mp14");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		} else if (currentMap != "map_pwb" && flagpw==1) {		
			map.removeLayer(PW14Map);
			flagpw = 0;
			//document.getElementById('map_pwb_sel').style.display="none"; //removing checkicon
			$('.map_pwb_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("map_pwb");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		} else if (currentMap != "map_lha" && flaglh==1) {					
			map.removeLayer(LHAPMap);
			flaglh = 0;
			//document.getElementById('map_lha_sel').style.display="none"; //removing checkicon
			$('.map_lha_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("map_lha");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		} else if (currentMap != "map_bhp" && flagbh==1) {		
			map.removeLayer(SUB_DESN_UD_heighlighted_GLayer);	//added by willy 25-sept-2014
			map.removeLayer(DESN_UDLayer);				//added by willy 25-sept-2014
			map.removeLayer(BHPMap);
			flagbh = 0;
			//document.getElementById('map_bhp_sel').style.display="none"; //removing checkicon
			$('.map_bhp_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("map_bhp");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		} else if (currentMap != "map_agu" && flagagu==1) {		
			map.removeLayer(AGUPMap);
			flagagu = 0;
			//document.getElementById('map_agu_sel').style.display="none"; //removing checkicon
			$('.map_agu_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("map_agu");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		} else if (currentMap != "map_sbud" && flagsbud==1) {		
			flagsbud = 0;			
			map.removeLayer(SBPUMap); //added by willy 25-sept-2014
            map.removeLayer(SUB_DESN_UD_heighlighted_GLayer);	//added by willy 25-sept-2014
			map.removeLayer(DESN_UDLayer);				
			//document.getElementById('map_sbud_sel').style.display="none"; //removing checkicon
			$('.map_sbud_sel').css({'display':'none'});
			addedMapsArray.splice(index, 1);
			var index = addedMapsArray.indexOf("map_sbud");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
						
		} else if (currentMap != "osm" && flagosm==1) {				
			map.removeLayer(StreetMap);
			flagosm = 0;
			//document.getElementById('osm_sel').style.display="none"; //removing checkicon
			$('.osm_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("osm");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		} else if (currentMap != "ollm" && flagollm==1) {			
			map.removeLayer(LandLotMap);
			flagollm = 0;
			//document.getElementById('ollm_sel').style.display="none"; //removing checkicon
			$('.ollm_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("ollm");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		}
		else if (currentMap != "wcb" && flagwcb==1) {			//added by lavanya satuluri 29 Aug 2014 
			//map.removeLayer(WaterColorMap);
			//added by lavanya satuluri 1-oct-2014 to destroy wcb when switching between various maps
			map.destroy();
			    map = new esri.Map("map-canvas", {
			     logo:false,
			    });
				//ended by lavanya satuluri 1-oct-2014
			flagwcb = 0;
			//document.getElementById('wcb_sel').style.display="none"; //removing checkicon
			$('.wcb_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("wcb");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		}
		else if (currentMap != "iss" && flagiss==1) {			//added by Bably 23 Oct 2014
			//map.removeLayer(WaterColorMap);
			//added by  Bably 23 Oct 2014 to destroy wcb when switching between various maps
			// map.destroy();
			    // map = new esri.Map("map-canvas", {
			     // logo:false,
			    // });
				//ended by  Bably 23 Oct 2014
			flagiss = 0;
			//document.getElementById('map_updatedmp_sel').style.display="none"; //removing checkicon
			$('.map_updatedmp_sel').css({'display':'none'});
			var index = addedMapsArray.indexOf("iss");
			if (index > -1) {
				addedMapsArray.splice(index, 1);
			}
		}
				
		switch (currentMap)
		{
		case "map_updatedmp":
			if(flagupdatedmp==0)
			{
				map.addLayer(UpdatedMPMap);
				flagupdatedmp = 1;
				//document.getElementById('map_updatedmp_sel').style.display="block"; //displaying checkicon
				$('.map_updatedmp_sel').css({'display':'block'});
				addedMapsArray.push("map_updatedmp");
				document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> Master Plan (approved amendments incorporated)";
				$("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend
			}
			//else
			//{
			//	map.removeLayer(UpdatedMPMap);
			//	flagupdatedmp = 0;
			//	document.getElementById('map_updatedmp_sel').style.display="none"; //removing checkicon
			
			//	var index = addedMapsArray.indexOf("map_updatedmp");
			//	if (index > -1) {
			//	addedMapsArray.splice(index, 1);
			//	}
			//}
			break;
		case "map_mp14":
			if(flagmp==0)
			{
				map.addLayer(MP14Map);
				flagmp = 1;
				//document.getElementById('map_mp14_sel').style.display="block"; //displaying checkicon
				$('.map_mp14_sel').css({'display':'block'});
				addedMapsArray.push("map_mp14");
				document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> Master Plan 2014";
				$("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend
			}
			//else
			//{
			//	map.removeLayer(MP14Map);
			//	flagmp = 0;
			//	document.getElementById('map_mp14_sel').style.display="none"; //removing checkicon
			
			//	var index = addedMapsArray.indexOf("map_mp14");
			//	if (index > -1) {
			//	addedMapsArray.splice(index, 1);
			//	}
			//}
			break;
		case "map_pwb":
			if(flagpw==0)
			{
				map.addLayer(PW14Map);
				flagpw = 1;
				//document.getElementById('map_pwb_sel').style.display="block"; //displaying checkicon
				$('.map_pwb_sel').css({'display':'block'});
				addedMapsArray.push("map_pwb");
				document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> Parks and Waterbodies Plan";
				$("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend
			}
			//else
			//{
			//	map.removeLayer(PW14Map);
			//	flagpw = 0;
			//	document.getElementById('map_pwb_sel').style.display="none"; //removing checkicon
			//	var index = addedMapsArray.indexOf("map_pwb");
			//	if (index > -1) {
			//	addedMapsArray.splice(index, 1);
			//	}
			//}
			
			break;
		case "map_lha":
			
			if(flaglh==0)
			{
				map.addLayer(LHAPMap);
				flaglh = 1;
				//document.getElementById('map_lha_sel').style.display="block"; //displaying checkicon
				$('.map_lha_sel').css({'display':'block'});
				addedMapsArray.push("map_lha");
				document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> Landed Housing Areas";
				$("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend
			}
			//else
			//{
			//	map.removeLayer(LHAPMap);
			//	flaglh = 0;
			//	document.getElementById('map_lha_sel').style.display="none"; //removing checkicon
			//	var index = addedMapsArray.indexOf("map_lha");
			//	if (index > -1) {
			//	addedMapsArray.splice(index, 1);
			//	}
			//}
			break;
		case "map_bhp":
			if(flagbh==0)
			{
				map.addLayer(BHPMap);
				flagbh = 1;
				//document.getElementById('map_bhp_sel').style.display="block"; //displaying checkicon
				$('.map_bhp_sel').css({'display':'block'});
				addedMapsArray.push("map_bhp");
				
				//********************* addded by willy 25-sept-2014
				SUB_DESN_UD_heighlighted_GLayer = new esri.layers.GraphicsLayer();					
				map.addLayer(SUB_DESN_UD_heighlighted_GLayer);										
								
				DESN_UD_LAYER_URL ='https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_DESN_UD_gaz/MapServer/3';
				
				queryTask = new esri.tasks.QueryTask(DESN_UD_LAYER_URL);
				query = new esri.tasks.Query();
				query.returnGeometry = true;
				query.outFields = ["REMARKS"];
				query.where="1=1";
				queryTask.execute(query,executeDESN_UD_LAYER);
				//********************* end by willy 25-sept-2014
				
				BH_BOTANIC_LAYER_URL ='https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_BH_Botanic_gaz/MapServer/1';
				
				queryTask = new esri.tasks.QueryTask(BH_BOTANIC_LAYER_URL);
				query = new esri.tasks.Query();
				query.returnGeometry = true;
				query.outFields = ["REMARKS"];
				query.where="1=1";
				queryTask.execute(query,executeBH_BOTANIC_LAYER);
				document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> Building Height Plan";
				$("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend
				
			}
			//else
			//{
			//	map.removeLayer(BHPMap);
			//	flagbh = 0;
			//	document.getElementById('map_bhp_sel').style.display="none"; //removing checkicon
			//	var index = addedMapsArray.indexOf("map_bhp");
			//	if (index > -1) {
			//	addedMapsArray.splice(index, 1);
			//	}
			//}
			break;
		case "map_agu":
			if(flagagu==0)
			{
				map.addLayer(AGUPMap);
				flagagu = 1;
				//document.getElementById('map_agu_sel').style.display="block"; //displaying checkicon
				$('.map_agu_sel').css({'display':'block'});
				addedMapsArray.push("map_agu");
				document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> Activity Generating Uses Plan";
				$("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend
			}
			//else
			//{
			//	map.removeLayer(AGUPMap);
			//	flagagu = 0;
			//	document.getElementById('map_agu_sel').style.display="none"; //removing checkicon
			//	var index = addedMapsArray.indexOf("map_agu");
			//	if (index > -1) {
			//	addedMapsArray.splice(index, 1);
			//	}
			//}
			break;
		case "map_sbud":		
			if(flagsbud==0)
			{
				flagsbud = 1;
				map.addLayer(SBPUMap);
				//document.getElementById('map_sbud_sel').style.display="block"; //displaying checkicon
				$('.map_sbud_sel').css({'display':'block'});
				$("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend
				addedMapsArray.push("map_sbud");
				
				SUB_DESN_UD_heighlighted_GLayer = new esri.layers.GraphicsLayer();	//added by willy 24-sept-2014				
				map.addLayer(SUB_DESN_UD_heighlighted_GLayer); //added by willy 24-sept-2014	
																
				DESN_UD_LAYER_URL ='https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_DESN_UD_gaz/MapServer/3';
				
				queryTask = new esri.tasks.QueryTask(DESN_UD_LAYER_URL);
				query = new esri.tasks.Query();
				query.returnGeometry = true;
				query.outFields = ["REMARKS"];				
				query.where="1=1";
				queryTask.execute(query,executeDESN_UD_LAYER);
				
				STREET_BLOCK_LAYER_URL = 'https://www.ura.gov.sg/ArcGis/rest/services/ppg/MP14_STREET_BLK_gaz/MapServer/0';
				
				queryTask = new esri.tasks.QueryTask(STREET_BLOCK_LAYER_URL);
				query = new esri.tasks.Query();
				query.returnGeometry = true;
				query.outFields = ["url"];
				query.where="1=1";
				queryTask.execute(query,executeSTREET_BLOCK_LAYER);
				
				document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> Street Block Plan, Urban Design Area, Conservation Areas & Monuments Plan";
							
			}
			//else
			//{
			//	flagsbud = 0;			
			//	map.removeLayer(SBPUMap);				
			//	document.getElementById('map_sbud_sel').style.display="none"; //removing checkicon
			//	addedMapsArray.splice(index, 1);
			//	var index = addedMapsArray.indexOf("map_sbud");
			//	if (index > -1) {
			//	addedMapsArray.splice(index, 1);
			//	}
							
			//}
			break;
		case "osm":
			if(flagosm==0)
			{	
			   flagosm = 1;
			//added by lavanya satu;uri 24 sept 2014 aude wcbmap
				if(audeSelect == 1){
				// map.destroy();
			    // map = new esri.Map("map-canvas", {
			     // logo:false,
			    // });
				map.addLayer(StreetMap);
				$("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend				
				graphicsLayer_AUDE =  new esri.layers.GraphicsLayer({id:"audeLayer"}); //added by lavanya satuluri 1 oct 2014 to switch btwn wcb & sm in maps
		        map.addLayer(graphicsLayer_AUDE); //added by lavanya satuluri 1 oct 2014 to switch btwn wcb & sm in maps
				queryAUDEPoints();
				}	
				else{
				map.addLayer(StreetMap);
				}
            //ended  by lavanya satu;uri 24 sept 2014 aude wcbmap				
				//map.addLayer(StreetMap); commented by lavanya satuluri 25 sept 2014 aude wcbmap
				
				//document.getElementById('osm_sel').style.display="block"; //displaying checkicon
				$('.osm_sel').css({'display':'block'});
				addedMapsArray.push("osm");
				map._params.maxZoom = StreetMap.tileInfo.lods.length - 1;
				document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> Street Map";
				
			}
			//else
			//{   
			//	map.removeLayer(StreetMap);
			//	flagosm = 0;
			//	document.getElementById('osm_sel').style.display="none"; //removing checkicon
			//	var index = addedMapsArray.indexOf("osm");
			//	if (index > -1) {
			//	addedMapsArray.splice(index, 1);
			//	}
			//}
			break;
		case "ollm":		   	
			if(flagollm==0) /**to check if land lot map is already added from sales button click event**/
			{				
				map.addLayer(LandLotMap);
				$("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend
				flagollm = 1;
				//document.getElementById('ollm_sel').style.display="block"; //displaying checkicon
				$('.ollm_sel').css({'display':'block'});
				addedMapsArray.push("ollm");
				map._params.maxZoom = LandLotMap.tileInfo.lods.length - 1;		
				document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> Land Lot Map";
			}
			//else
			//{
			//	map.removeLayer(LandLotMap);
			//	flagollm = 0;
			//	document.getElementById('ollm_sel').style.display="none"; //removing checkicon
			//	var index = addedMapsArray.indexOf("ollm");
			//	if (index > -1) {
			//	addedMapsArray.splice(index, 1);
			//	}
			//}
			break;
			
			case "wcb": //added by lavanya satuluri 29 Aug 2014
			if(flagwcb==0)
			{	
			 map.destroy();
			 $("#divLegendInventory").css('display','none'); //added by bably for Inventory Legend
			 map = new esri.Map("map-canvas", {
			  logo:false,
			 });
			 var pointWCB = new esri.geometry.Point();
			 pointWCB.spatialReference = new esri.SpatialReference();
             pointWCB.spatialReference.wkid = 4326;
			 pointWCB.x = 103.83770938085762;
			 pointWCB.y =  1.3679351968408462;
             //pointWCB.x = 103.850069427001;
             //pointWCB.y = 1.28966783400045;
			 // var wcbMap = new esri.layers.WebTiledLayer("http://${subDomain}.tile.stamen.com/watercolor/${level}/${col}/${row}.jpg", {         
                                 // "subDomains": ["a", "b", "c","d"]		  
             // });
			  var wcbMap = new esri.layers.WebTiledLayer(WATERCOLORMap_URL, {         
                                 "subDomains": ["a", "b", "c","d"]		  
             });
             map.addLayer(wcbMap);
			 map.centerAndZoom(pointWCB,12);
			flagwcb = 1;
			//document.getElementById('wcb_sel').style.display="block"; //displaying checkicon
			$('.wcb_sel').css({'display':'block'});
			addedMapsArray.push("wcb");
			map._params.maxZoom = wcbMap.tileInfo.lods.length - 1;
			document.getElementById("txtSelectedMap").innerHTML = "You are viewing:<font style='font-weight:bold;'> WaterColor Map.</font> Map tiles by  <a href='http://stamen.com'><font style='font-weight:bold;'>Stamen Design</font></a>, under <a href='http://creativecommons.org/licenses/by/3.0'><font style='font-weight:bold;'>CC BY 3.0</font></a>.";
			 if(audeSelect == 1){ //added by lavanya satuluri 14 oct 2014
			 graphicsLayer_AUDE =  new esri.layers.GraphicsLayer({id:"audeLayer"}); //added by lavanya satuluri 26 sept 2014
		     map.addLayer(graphicsLayer_AUDE);
			 loadingImg(0, "");
			 queryAUDEPoints();
			} //added by lavanya satuluri 14 oct 2014
			}
			break;	
			
			case "iss": //added by Bably 23 oct 2014
			if(flagiss==0){
				InventorySalesMap = new esri.layers.ArcGISDynamicMapServiceLayer(Inventory_Sales_URL, {
									"id": "InventorySalesMap",
									"opacity" : 0.9						  
									  }); 
				
				map.addLayer(UpdatedMPMap);		
				$("#divLegendInventory").css('display','block'); //added by bably for Inventory Legend			
				map.addLayer(InventorySalesMap);
				flagiss = 1;
				//document.getElementById('map_updatedmp_sel').style.display="block"; //displaying checkicon
				$('.map_updatedmp_sel').css({'display':'block'});
				inventoryGraphicLayer =  new esri.layers.GraphicsLayer({id:"inventoryGraphicLayer"});  
				map.addLayer(inventoryGraphicLayer);				
				addedMapsArray.push("iss"); 
			} 
			break;	
		}
		
		CheckSetMapZoomMax();		
		populateDrDn(); //population of transparency drop down	
		
	//Added Venkat for Andriod
			var useragent = navigator.userAgent.toLowerCase();
			var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");
			if(isAndroid) 
			{
			closeLegendAndriod();
			getLegendandriod();
			$('#basemap_Andriod_Maps').hide();
			}
			else
			{
			//added by lavanya satuluri 15 oct 2014	
			closeLegend();
			getLegend();
			if (closeDialog) 
			{		
			$('#basemap').dialog('close');
			}
			}
	
	}
		
		
		
		function CheckSetMapZoomMax() {
		var osm_added = addedMapsArray.indexOf("osm");
		var ollm_aded = addedMapsArray.indexOf("ollm");
		var wcb_added = addedMapsArray.indexOf("wcb");  // added by lavanya satuluri 25 september 2014 - aude
		//if(osm_added == -1 && ollm_aded == -1 ) { // if none of one maps are added limit zoom level to 6 - commented by lavanya satuluri 25 september 2014
		if(osm_added == -1 && ollm_aded == -1 && wcb_added == -1) {  // if none of one maps are added limit zoom level to 6 - added by lavanya satuluri 25 september 2014
			map._params.maxZoom = 6;					
			if (map.getLevel() > map._params.maxZoom)
			{
				map.setLevel(map._params.maxZoom);
			}				
		}
		else {
			$( ".esriSimpleSliderIncrementButton" ).removeClass( "esriSimpleSliderDisabledButton")
		}		
	}
	function CheckSetMapZoomMaxOriginal() {
		var osm_added = addedMapsArray.indexOf("osm");
		var ollm_aded = addedMapsArray.indexOf("ollm");
		
		if(osm_added == -1 && ollm_aded == -1) { // if none of one maps are added limit zoom level to 6
					
			map._params.maxZoom = 6;					
			if (map.getLevel() > map._params.maxZoom)
			{
				map.setLevel(map._params.maxZoom);
			}				
		}
		else {
			$( ".esriSimpleSliderIncrementButton" ).removeClass( "esriSimpleSliderDisabledButton")
		}		
	}
	

	function executeBH_BOTANIC_LAYER(featureSet) {		
		var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,225]), 3), new dojo.Color([255,255,255,0]));		        
		botanicLayer = new esri.layers.GraphicsLayer();	
        map.addLayer(botanicLayer);
		flagGL = 1;
		map.graphics.enableMouseEvents();
        dojo.forEach(featureSet.features, function(feature) {
		  botanicLayer.add(feature.setSymbol(symbol));
        });
		
		var highlightSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255]), 3), new dojo.Color([255,0,0, 0.3]));
		var dashSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);

		/** check if there is an existing click even graphics layer **/
		if (connectionsEvent.length > 0) {
			dojo.forEach(connectionsEvent, dojo.disconnect);
			connectionsEvent=[];			 
		}		
		/** Push event handle ***/
		connectionsEvent.push(dojo.connect(map.graphics, "onClick", function(evt) {		   					
		 	map.graphics.remove(highlightClickedGraphic);
            highlightClickedGraphic = new esri.Graphic(evt.graphic.geometry,dashSymbol);
            map.graphics.add(highlightClickedGraphic);			
			window.open(remarks);
          }));
		   
		 dojo.connect(botanicLayer, "onMouseOver", function(evt) {		    
			map.graphics.clear();
			var highlightGraphic = new esri.Graphic(evt.graphic.geometry,highlightSymbol);
            map.graphics.add(highlightGraphic);
			remarks = evt.graphic.attributes.REMARKS;						
          });
		  
		  dojo.connect(map.graphics, "onMouseOut", function(evt) {
            map.graphics.clear();			
          });
		 
      }	  
	  
	  function executeDESN_UD_LAYER(featureSet) {			  
		var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,225]), 3), new dojo.Color([255,255,255,0]));		        
		DESN_UDLayer = new esri.layers.GraphicsLayer();		
        map.addLayer(DESN_UDLayer);
		flagGL = 1;
		map.graphics.enableMouseEvents();
        dojo.forEach(featureSet.features, function(feature) {
		  DESN_UDLayer.add(feature.setSymbol(symbol));
        });
		
		var highlightSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255]), 3), new dojo.Color([255,0,0, 0.3]));
		var dashSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
		
		/** check if there is an existing click even graphics layer **/
		/** start commented by willy 25-Sep-2014
		if (connectionsEvent.length > 0) {
			dojo.forEach(connectionsEvent, dojo.disconnect);
			connectionsEvent=[];			 
		}		
		**/		
		/** Push event handle ***/
		/**
		connectionsEvent.push(dojo.connect(map.graphics, "onClick", function(evt) {		  
		 	map.graphics.remove(highlightClickedGraphic);
            highlightClickedGraphic = new esri.Graphic(evt.graphic.geometry,dashSymbol);
            map.graphics.add(highlightClickedGraphic);			
			window.open(remarks);
          }));
		  End commented by willy 25-Sep-2014
		**/ 
		   
		 dojo.connect(DESN_UDLayer, "onMouseOver", function(evt) {
			//map.graphics.clear(); commented by willy 25-Sep-2014
			var highlightGraphic = new esri.Graphic(evt.graphic.geometry,highlightSymbol);
			// start commented by willy 25-Sep-2014
            //map.graphics.add(highlightGraphic);						
			//remarks = evt.graphic.attributes.REMARKS;
			//--remarks = evt.graphic.attributes.url;			
			// end commented by willy 25-Sep-2014
			highlightGraphic.setAttributes(evt.graphic.attributes)		
			SUB_DESN_UD_heighlighted_GLayer.clear()				
			SUB_DESN_UD_heighlighted_GLayer.add(highlightGraphic);											
          });
		  dojo.connect(DESN_UDLayer, "onMouseOut", function(evt) {
				//map.graphics.clear(); commented by willy 25-Sep-2014
				SUB_DESN_UD_heighlighted_GLayer.clear()				
          });
		  //Start added by willy 25-Sep-2014
		  dojo.connect(DESN_UDLayer, "onClick", function(evt) {		  
            window.open(evt.graphic.attributes.REMARKS);			
          });
		  //End added by willy 25-Sep-2014
		  
		 
      }	  
	  
	  function executeSTREET_BLOCK_LAYER(featureSet) {		
		//var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,225]), 3), new dojo.Color([255,255,255,0]));		        
		var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL, new dojo.Color([255,255,255]), 10), new dojo.Color([255,255,255,0]));		        
		
		SBLayer = new esri.layers.GraphicsLayer();		
        map.addLayer(SBLayer);
		flagGL = 1;
		map.graphics.enableMouseEvents();
		
        dojo.forEach(featureSet.features, function(feature) {
		  SBLayer.add(feature.setSymbol(symbol));
        });
				
		//var highlightSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0,0,255]), 3), new dojo.Color([255,0,0, 0.3]));
		//var dashSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
		var highlightSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL, new dojo.Color([255,255,255]), 10), new dojo.Color([255,0,0, 0.3]));
		var dashSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL, new dojo.Color([255, 255, 255]), 10);
		
		/**
		dojo.connect(map.graphics, "onClick", function(evt) {				
		 	map.graphics.remove(highlightClickedGraphic);
            highlightClickedGraphic = new esri.Graphic(evt.graphic.geometry,dashSymbol);
            map.graphics.add(highlightClickedGraphic);			
			window.open(remarks);
          }); 
		 **/
		 
		 dojo.connect(SBLayer, "onMouseOver", function(evt) {
			//map.graphics.clear(); commented by willy 25-Sep-2014
			var highlightGraphic = new esri.Graphic(evt.graphic.geometry,highlightSymbol);
			SUB_DESN_UD_heighlighted_GLayer.clear();
            //map.graphics.add(highlightGraphic); commented by willy 25-Sep-2014
			//remarks = evt.graphic.attributes.URL; commented by willy 25-Sep-2014															
			highlightGraphic.setAttributes(evt.graphic.attributes);				
			SUB_DESN_UD_heighlighted_GLayer.add(highlightGraphic);						
          });
		  dojo.connect(SBLayer, "onMouseOut", function(evt) {
				//map.graphics.clear(); commented by willy 25-Sep-2014							
				SUB_DESN_UD_heighlighted_GLayer.clear()
          });
		 
		  // start added by willy 25-Sep-2014
		  dojo.connect(SBLayer, "onClick", function(evt) {			
            window.open(evt.graphic.attributes.URL)
          });
		  // End added by willy 25-Sep-2014
      }	  

	/**
	*  Location & MK/TS Lot number search
	*/ 
	function GetSearchData()	{
		var searchText = document.getElementById("txtSearchText").value;
		var suggest = $('.search-suggest');
		var remove = $('.search-remove');
		
		$('#splashscreen').hide(10000);
		
		if (searchText.length >0)
		{
			 /* $('.search').hide();  */
			 $('.clear').show();
		}
		else
		{
			 $('.search').show();
			 $('.clear').hide();
		}
		if (searchText.length < 3){
			 $('.search-suggest').hide();
			 return;
		}
		else
		{
			var checkvar = searchText.substring(0, 3);

			if((checkvar[0]=="M" && checkvar[1]=="K" && !isNaN(checkvar[2])) || (checkvar[0]=="m" && checkvar[1]=="k" && !isNaN(checkvar[2])) || 
			(checkvar[0]=="T" && checkvar[1]=="S" && !isNaN(checkvar[2])) || (checkvar[0]=="t" && checkvar[1]=="s" && !isNaN(checkvar[2])))
			//Land lot number always starts with â€œMKxâ€ or â€œTSxâ€, where x is a numeric digit - then go for theme search
				{
					doThemeSearch(searchText,'1',1);
				}
			else
			//Go for location search - basic search
			{
				// to remove extra space in the string
				var string =searchText; // abc  brickworks  --> abc brickworks
				var array = string.split(" ");
				string = "";
					for(var i=0; i<array.length; i++)
					{
						if(array[i] != "")
						{
							string += array[i];
							if(i<array.length-1) string += " ";
						}
					}
				doAddressSearch(string,'1',1); 			
					
			}
		}
	}
	
	/**
	* For clearing the text box
	*/ 
	function clr(){
			document.getElementById("txtSearchText").value = "";
			$('.search-suggest').hide();	
			$('.search').show();
			$('.clear').hide();	
			map.graphics.remove(map.graphics.graphics[map.graphics.graphics.length -1])
			
	}
	
	/**
	* Customize ajax call to get one map basic address search result by location
	*/
	function doAddressSearch(searchVal,returnGeom,rset){
		document.getElementById("txtSearchText").value=searchVal;
		//var whereclause = "SEARCHVAL LIKE %'"+searchVal+"'%"; //commented to overcome search issue
		var whereclause = "SEARCHVAL LIKE '"+searchVal+"'"; // added by lavanya satuluri 26-Aug-2014 
	 $.ajax({
		    url: ONEMAP_ADDRESS_SEARCH_URL + '&wc='+whereclause+'&returnGeom='+returnGeom+'&rset='+rset,
			type : 'GET',
			crossDomain : true,
			dataType : 'jsonp',
			success : function(data) 
			{
				var outPutResults = new Object;
		        outPutResults.nop = data.SearchResults[0].PageCount;
		        outPutResults.results = data.SearchResults.splice(1, data.SearchResults.length);
		        if (outPutResults.results.length === 0) 
				{
					outPutResults.results = 'NR'; 
					
				}
				 displayData(outPutResults);
		         
 			},
			error : function() { 
				alert('Error in Onemap search address.');
			}
		});	
	}
	
	/**
	* Customize ajax call to get one map theme search result by lot number
	*/
	function doThemeSearch(value,returnGeom,rset) {
	 $.ajax({
	       url: ONEMAP_THEME_SEARCH_URL + '&searchVal='+value+'&returnGeom='+returnGeom+'&rset='+rset,
			type : 'GET',
			crossDomain : true,
			dataType : 'jsonp',
			success : function(data) 
			{
				var outPutResults = new Object;
		        outPutResults.nop = data.SearchResults[0].PageCount;
		        outPutResults.results = data.SearchResults.splice(1, data.SearchResults.length);
		        if (outPutResults.results.length === 0)
				{
					outPutResults.results = 'NR'; 
					
				}
		      	 displayData(outPutResults);
				 
 			},
			error : function() { 
				alert('Error in Onemap search address.');
			}
		});	
	}
	
	function displayData(resultData){
		var sslContent =  $('#divResults'); 
		results = resultData.results;
		var length = results.length;
		//var sslContent =  $('#divResults');
		var htmlStr = "<table width='100%'><tr><td>";
		var searchText = $('.search-input').val();
      
		if (results=='NR' || length == 0)
		{  
			
			htmlStr = htmlStr + "<th><font color='red'>NO RESULTS FOUND</font></th>";
			htmlStr = htmlStr + "</table>";
			document.getElementById('divResults').style.height="60px"; // changed from 35 to 60 - lavanya satuluri 1-oct-2014
			document.getElementById('divResults').style.width="407px"; // changed from 317 to 407 - lavanya satuluri 1-oct-2014
			document.getElementById('divResults').innerHTML = htmlStr;
			document.getElementById('search-suggest').style.display = "block";
					
		    return false
        }
		else
		{			
			if(length > 5)
			{
				for (var i = 0; i < 5; i++) 
				{
				  //  txtSearch = 1; //added by lavanya 1-oct-2014
					var row = results[i];
					
					var searchText = $('.search-input').val().toUpperCase();
					searchText = $.trim(searchText);	// remove the first and last unwanted space eg:- <45 MA > to <45 MA>
					var str = row.SEARCHVAL;
					_globalSearch=str;
					var res = str.split(searchText);						
					var str1 = searchText;	
							
					var str2 = res[1];	
					var _textparam=	str1+str2;										
					htmlStr = htmlStr + "<a class='css_btn_class' href='JavaScript:zoomSearchAddressTo("+ row.X +","+ row.Y +","+ i +")'><b>" + str1 + "</b>" + str2 + "</a>";										
				}				
				htmlStr = htmlStr + "</td></tr></table>";
			}
			else
			{	
               // txtSearch = 1;//added by lavanya 1-oct-2014		 	
				for (var i = 0; i < length; i++) 
				{										
					var row = results[i];
					
					var searchText = $('.search-input').val().toUpperCase();
					searchText = $.trim(searchText);	// remove the first and last unwanted space eg:- <45 MA > to <45 MA>
					var str = row.SEARCHVAL;
					_globalSearch=str;
					var res = str.split(searchText);						
					var str1 = searchText;	
							
					var str2 = res[1];	
					var _textparam=	str1+str2;			
					htmlStr = htmlStr + "<a class='css_btn_class' href='JavaScript:zoomSearchAddressTo("+ row.X +","+ row.Y +","+ i +")'><b>" + str1 + "</b>" + str2 + "</a>";
				}				
				htmlStr = htmlStr + "</td></tr></table>";
			}
		}				
		document.getElementById('divResults').innerHTML = htmlStr;
		document.getElementById('search-suggest').style.display = "block";			
       }
	
	 /**
	 * Zoom to search address 
	 * @param lat
	 * @param lng
	 */
	 function zoomSearchAddressTo(lat,lng,i){   //  updated by lavanya satuluri 18-sept-2014 to watercolor bm - search zoom 
		//added by lavanya 1-oct-2014
		// if(txtSearch = 1){
		// clearSearchGraphic += 1;
		// if(clearSearchGraphic > 1){
		// map.graphics.remove(map.graphics.graphics[map.graphics.graphics.length -1]);
		// txtSearch = 0;
		// }
		// }
		//end by lavanya 1-oct-2014
		$('.search-suggest').hide();
		var address = i;
		
		//document.getElementById("txtSearchText").value = address; /**After selecting a result (e.g. 45 MANDALAY ROAD), the resultâ€™s text should show in the search bar rather than â€œ45 maâ€.**/
		var point = new esri.geometry.Point( {'x':lat, 'y':lng,'spatialReference': {'wkt': 'PROJCS["WGS_1984_Transverse_Mercator",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",28001.642],PARAMETER["False_Northing",38744.572],PARAMETER["Central_Meridian",103.8333333333333],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",1.366666666666667],UNIT["Meter",1.0]]'} }); 
		if (lat) 
		{
		 var url = ONEMAP_API_URL + 'ga?token=' + ONEMAP_TOKEN + '&sv=' + address;
				$.ajax({
					url: url,
					type:'GET',
					crossDomain:true,
					dataType: 'jsonp',
					success: function (data){
						 var geoAddr = data.GeoAddrInfo[0];
						 var result = geoAddr.BLDG_NAME + ' '+geoAddr.HBRN + ' ' + geoAddr.PostalCode;
						  //added by lavanya satuluri 18-sept-2014 to watercolor bm - search zoom 
						 if(audeSelect == 1){
							  var gsvc = new esri.tasks.GeometryService("https://www.ura.gov.sg/ArcGis/rest/services/Utilities/Geometry/GeometryServer");
							  var symbol = new esri.symbol.PictureMarkerSymbol('./src/css/custom/img/red_glow.gif', 50, 50); 
							  var outSR = new esri.SpatialReference({ wkid: 4326});
							  gsvc.project([ point ], outSR, function(features){ 
							  var wcbpoint = new esri.geometry.Point(features[0].x,features[0].y,new esri.SpatialReference({ wkid: 4326 }));
							  var marker = new esri.Graphic(wcbpoint,symbol);
							  map.graphics.add(marker); 
							  //addInfowindow(wcbpoint,'Address',result);
							  
							    map.setZoom(6);
							  
							  map.centerAt(wcbpoint);
							   map._params.maxZoom = 7;
							 // map.centerAndZoom(wcbpoint,17);
							 
							 
							  });
		                }
						else{
						//end  by lavanya satuluri 18-sept-2014 to watercolor bm - search zoom 
												
						   addMarker(point,1);
						  // addInfowindow(point,'Address',result);
						    map.setZoom(100);
							
											 						  
						    map.centerAt(point);
						 map._params.maxZoom = 100;
						
						
						   map.setZoom(5);
						    map.centerAt(point);
						 }  //added by lavanya satuluri 18-sept-2014 to watercolor bm - search zoom 
						
					},
					error: function (error){
						 addMarker(point,1);
						 addInfowindow(point,'Address',address);
						 map.setZoom(6);
						 map.centerAt(point);
						  map._params.maxZoom = 7;
					}
				});
		}
		
	}
	 
	
	/**
	* Get user location using html 5 geolocation api, need to perform projection from lat,long in degree to decimal (svt21,aka 3414)
	*/
	function getUserLocation(){ 
		if (navigator.geolocation) 
		{
		   var options = {
				enableHighAccuracy: false,
				timeout: 30000,  // milliseconds (30 seconds)
				maximumAge: 600000 // milliseconds (10 minutes)
			};
			navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError, options);
		}
		else {alert('User browser can not detect geolocation.');}
	}
	/**
	* Geolocation success, zoom to location
	* @param position
	*/
	function handleGeoSuccess(position){
		var latlng = new esri.geometry.Point( {'y': position.coords.latitude, 'x': position.coords.longitude,'spatialReference': {'wkid': 4326 } });
		projectTo(latlng);
	}
	/**
	* From latlng to svy21 projection using Geometry Service
	* @param latlng
	*/
	
	function projectTo(latlng){
	if (latlng) 
	{
	//added by lavanya satuluri 2-oct 2014 for wcb
	if(audeSelect == 1){
	        var outSR = new esri.SpatialReference({ wkid: 4326});
		    GEOMETRY_SVC.project([latlng], outSR, function(features) {
			//console.log(features);
			var point = new esri.geometry.Point(features[0].x,features[0].y,new esri.SpatialReference({ wkid: 4326 }));	
			addMarker(point,2);
			addInfowindow(point,'Location','You are here!');
			map.setZoom(12);
		    map.centerAt(point);
            map._params.maxZoom = 18;						 
		});
	}
	else{
	//end lavanya satuluri 2- oct-2014 
		    var outSR = new esri.SpatialReference({ wkid: 3414});
		    GEOMETRY_SVC.project([latlng], outSR, function(features) {
			//console.log(features);
			var point = features[0];
			addMarker(point,2);
			addInfowindow(point,'Location','You are here!');
			map.setZoom(6);
			pointTest = new esri.geometry.Point( {'x':point.x, 'y':point.y,'spatialReference': {'wkt': 'PROJCS["WGS_1984_Transverse_Mercator",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",28001.642],PARAMETER["False_Northing",38744.572],PARAMETER["Central_Meridian",103.8333333333333],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",1.366666666666667],UNIT["Meter",1.0]]'} }); 		
			map.centerAt(pointTest);						 
		});
		} //added by lavanya satuluri 2-oct 2014 for wcb
	}
	}
	
	function projectTo123(latlng){
	if (latlng) 
	{
	
	
		var outSR = new esri.SpatialReference({ wkid: 3414});
		GEOMETRY_SVC.project([latlng], outSR, function(features) {
			//console.log(features);
			var point = features[0];
			addMarker(point,2);
			addInfowindow(point,'Location','You are here!');
			map.setZoom(6);
			pointTest = new esri.geometry.Point( {'x':point.x, 'y':point.y,'spatialReference': {'wkt': 'PROJCS["WGS_1984_Transverse_Mercator",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",28001.642],PARAMETER["False_Northing",38744.572],PARAMETER["Central_Meridian",103.8333333333333],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",1.366666666666667],UNIT["Meter",1.0]]'} }); 		
			map.centerAt(pointTest);						 
		});
	}
	}

	/**
	* Geolocation error code
	* @param error
	*/
	function handleGeoError(error){ 
		switch (error.code) 
		{
				case error.PERMISSION_DENIED:
					// User denied access to location. Perhaps redirect to alternate content?
					alert('Unable to detect current location.');
					break;
				case error.POSITION_UNAVAILABLE:
					alert('Position is currently unavailable.');
					break;
				case error.PERMISSION_DENIED_TIMEOUT:
					alert('User took too long to grant/deny permission.');
					break;
				case error.UNKNOWN_ERROR:
					alert('Unable to detect current location.');
		}
	}
	
	/**
	 * Handle adding maker graphic event on map, latlng in SVY21
	 */
	function addMarker(latlng,flag) {
		if (map.graphics){
			 map.graphics.clear();
		}
		if(flag==1) // differentiate if it is search location or get location
		{
			//var symbol = new esri.symbol.PictureMarkerSymbol('./src/css/custom/img/red-pin.png', 37, 75); //commented by lavanya satuluri 9-sept-2014
			var symbol = new esri.symbol.PictureMarkerSymbol('./src/css/custom/img/red_glow.gif', 50, 50); //added by lavanya satuluri 9-sept-2014
		}
		else
		{			
			var symbol = new esri.symbol.PictureMarkerSymbol('./src/css/custom/img/locate-pin.png', 55, 55);
		}
		var marker = new esri.Graphic(latlng, symbol);
		map.graphics.add(marker);
		
		//lavanya test 12 sept 2014
		 // if(audePlanFlag == 1)
		// {
		  // queryAUDEPoints();
		// }
	}
	
	/**
	 * Add infowindow in map
	 * @param latlng
	 * @param title
	 * @param html
	 */
	function addInfowindow(latlng,title,html){
		var content = '<div><br/></div>'+html+'<div><br/></div>';	
		map.infoWindow.setTitle(title);
		map.infoWindow.setContent(content);
		map.infoWindow.show(latlng);
		//lavanya satuluri Aug 27 2014 - to remove the searched address graphic on closing the infowindow
		dojo.connect(map.infoWindow._hide, "onclick", function(){  
		 map.infoWindow.hide();
         map.graphics.remove(map.graphics.graphics[map.graphics.graphics.length -1])
});  
        //end lavanya satuluri
		
	}
	
	
	
	
	
	/**
	* Zoom to current location 
	*/
	function showGeoLocation(xVal, yVal) {
		XYGraphicsLayer = new esri.layers.GraphicsLayer();
		map.addLayer(XYGraphicsLayer);

		var xval = xVal;
		var yval = yVal;
		if (isNaN(xval) && isNaN(yval)) 
		{
		}
		else 
		{
			var XYLocation = new esri.geometry.Point(xval, yval, new esri.SpatialReference({ wkid: 3414 }))
			var XYGraphic = new esri.Graphic(XYLocation);
			XYGraphicsLayer.add(XYGraphic);
			var Srchpoint = new esri.geometry.Extent(XYLocation.x - 150, XYLocation.y - 150, XYLocation.x + 150, XYLocation.y + 150, map.spatialReference);
			map.setExtent(Srchpoint);
		}
	}
		  
	/**
	 * Geolocation error code
	 * @param error
	 */
	function handleGeoError(error){ 
		switch (error.code) {
				case error.PERMISSION_DENIED:
					// User denied access to location. Perhaps redirect to alternate content?
					alert('Unable to detect current location.');
					break;
				case error.POSITION_UNAVAILABLE:
					alert('Position is currently unavailable.');
					break;
				case error.PERMISSION_DENIED_TIMEOUT:
					alert('User took too long to grant/deny permission.');
					break;
				case error.UNKNOWN_ERROR:
					alert('Unable to detect current location.');
		}		
		loadingImg(0, "");
	}
	
	
	 /**
	 *Common alert box
	 */
		// Show the dialog
	function showDialog(message) {	
		document.getElementById('lblajaxDialog').innerHTML = message;
		dijit.byId("ajaxDialog").show();
	}
		// Hide the dialog
	function underlay()	{
		dojo.destroy('ajaxDialog_underlay');
		dijit.byId("ajaxDialog").hide();
	}

	 /**
	 * Open and close the side bar and adjust the header positioning 
	 */	
	function openSideBar(){	
       //added by lavanya satuluri 19-aug-2014
	    var rightspace;
		if (rightdrawerShowFlag == 0) {
			rightspace = 0;						
			$('#divrightDrawerShowHidebtn').animate({
						right : rightspace,					
						display: 'toggle'
			}, "slow");			 			
			$(".rightDrawer").hide("slide", {direction : "right"}, "slow");
			$("#rightDrawerShowHidebtn").attr('class', 'rightDrawerShowHidebtnMax');
		 //	rightdrawerShowFlag = 1;
			}
	    //end lavanya satuluri	
		var leftspace = $('#leftDrawer').width();
		leftspace = leftspace + 14;				
		if(leftdrawerShowFlag == 0)
		{	/*** open show left drawer **/			 					    
			 $(".leftDrawer").show("slide", {direction : "left"}, "slow");
			 leftdrawerShowFlag = 1;
						
			$('#map-canvas_zoom_slider').animate({
						left : leftspace,					
						display: 'toggle'
				}, "slow");			
			
			 
			 $('.header').animate({
				 position: 'absolute',
					marginLeft: '250px',
					display: 'toggle'
				}, "slow");
		}
		else
		{	/*** open hide left drawer **/		
			leftspace = "16px";
			 $(".leftDrawer").hide("slide", {direction : "left"}, "slow");			 
			 leftdrawerShowFlag = 0;
			
			$('#map-canvas_zoom_slider').animate({
						left : leftspace,					
						display: 'toggle'
				}, "slow");			 
			 			 
			  $('.header').animate({
				 position: 'absolute',
					marginLeft: '0px',
					display: 'toggle'
				}, "slow");			
		}
		//added by lavanya satuluri AUDE Service 9-Sept-2014 
		var service_parm = getUrlParameter('service');
		if (typeof service_parm === "undefined") {
		
		}
		else if (service_parm.toUpperCase().indexOf('AUDE') >=  0)
		{
			document.getElementById("idbuyBtn").innerHTML = "";
			document.getElementById("iddwldBtn").innerHTML = "";
			document.getElementById("idbuyBtn").style.display="none";
			document.getElementById("iddwldBtn").style.display="none";
			document.getElementById("divSpacing1").style.display="none";
			document.getElementById("divSpacing2").style.display="none";
		}
		
		//end by lavanya satuluri 
		//added by lavanya satuluri 2-oct 2014
		else {
		document.getElementById("idAUDEBtn").innerHTML = "";
	    document.getElementById("idAUDEBtn").style.display="none";
			
		}
		//end lavanya satuluri 2-oct-2014
	}
	
	// Start AUDE - added by lavanya satuluri 20-Aug-2014
	function closeLeftPanel() {
		//collapse the left panel
		$(".leftDrawer").hide("slide", {direction : "left"}, "slow");
		
		//move map zoom slider
		var leftspace =  "16px";
		$('#map-canvas_zoom_slider').animate({
						left : leftspace,					
						display: 'toggle'
		}, "slow");
		
		//move menu icon
		$('.header').animate({
				 position: 'absolute',
					marginLeft: '0px',
					display: 'toggle'
			}, "slow");
			
		//move search suggestion
		if(document.getElementById("search-suggest").style.display == "block")
		{
			$('.search-suggest').animate({
			 position: 'absolute',
				marginLeft: '0px',
				display: 'toggle'
			}, "slow");
		}
	}
	//end AUDE 20-Aug-2014
	
	/**
	 * Populate the dropdown when the select map dialog is close - to adjust opacity of added maps
	 */
	 var htmlStr1 = ""; 
	 var selected_value = "map_updatedmp"; //by default master plan 
	 
	function populateDrDn(){
		dijit.byId("horizontalSlider").set("value", 100); // reset slider value each close
		var length = addedMapsArray.length;
		
		var htmlStr1 = "<label><font color='white'>Adjust Transparency</font></label> ";
		htmlStr1 = htmlStr1 + "<select id='opacitydd' style='width:100%;height:30px' onChange='opacitySlider(this.value)'>";
			
		for(var i = length;i>=0;i--) /* The item being selected by default in the dropdown list should be the last item added */
			{
				if (buyMasterPlanFlag == 0 ) {
					if(addedMapsArray[i] == "map_mp14"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Master Plan 2014</option>";}
					if(addedMapsArray[i] == "map_pwb"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Parks and Water bodies</option>";}
					if(addedMapsArray[i] == "map_lha"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Landed Housing Areas Plan</option>";}
					if(addedMapsArray[i] == "map_sbud"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Street Block Plan, Urban Design Area, Conservation Areas & Monuments Plan</option>";}
					if(addedMapsArray[i] == "map_bhp"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Building Height Plan</option>";}
					if(addedMapsArray[i] == "osm"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Street Map</option>";}
					if(addedMapsArray[i] == "ollm"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Land Lot Map</option>";}
					if(addedMapsArray[i] == "map_agu"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Activity Generating Uses</option>";}	
					if(addedMapsArray[i] == "wcb"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Water Color Map</option>";}	//added by lavanya satuluri 29 Aug 2014 AUDE
					if(addedMapsArray[i] == "iss"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Inventory Sales Site</option>";}	//added by Bably 23 oct 2014 
				}
				else {
					if(addedMapsArray[i] == "osm"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Street Map</option>";}
					if(addedMapsArray[i] == "ollm"){htmlStr1 = htmlStr1 + "<option value ="+addedMapsArray[i]+">Land Lot Map</option>";}
				}
				
			}
		
		htmlStr1 = htmlStr1 + "</select>";
		document.getElementById('ddDiv').innerHTML = htmlStr1;
		/*if (length>1) {
			document.getElementById('divOpacity').style.display="block";
		} else {
			document.getElementById('divOpacity').style.display="none";
		}*/
		selected_value = addedMapsArray[length-1];	
		}
	
	/**
	 * Adjust the map opacity based on dropdown selection
	 */
	
	function opacitySlider(value){
		//alert(value);
		/** To move the selected map to the top 
			remove the layer and add it again 12 May 2014**/			
		switch (value)
		{
			case "map_mp14":
				map.removeLayer(MP14Map);
				map.addLayer(MP14Map);
				break;
			case "map_pwb":
				map.removeLayer(PW14Map);
				map.addLayer(PW14Map);
				break;
			case "map_lha":
				map.removeLayer(LHAPMap);
				map.addLayer(LHAPMap);
				break;
			case "map_bhp":
				map.removeLayer(BHPMap);
				map.addLayer(BHPMap);
				break;
			case "map_agu":
				map.removeLayer(AGUPMap);
				map.addLayer(AGUPMap);
				break;
			case "map_sbud":
				map.removeLayer(SBPUMap);
				map.addLayer(SBPUMap);				
				break;
				//added by lavanya satuluri 29 Aug 2014 AUDE
			case "wcb":
				map.removeLayer(WaterColorMap);
				map.addLayer(WaterColorMap);				
				break;
				//end lavanya satuluri 29 Aug 2014 AUDE
			case "osm":
				map.removeLayer(StreetMap);
				map.addLayer(StreetMap);
				break;
			case "ollm":
				map.removeLayer(LandLotMap);
				map.addLayer(LandLotMap);
				break;				
				//added by Bably 23 Oct 2014
			case "wcb":
				map.removeLayer(InventorySalesMap);
				map.addLayer(InventorySalesMap);				
				break;
				//end Bably 23 Oct 2014
		}
		
		dijit.byId("horizontalSlider").set("value", 100); // reset slider value on dd change
		document.getElementById('forSlider').innerHTML = 100;
		
		selected_value = value;
		if(selected_value!="N/A")
		{
			document.getElementById("horizontalSlider").style.display = "block";
		}
		else
		{
			document.getElementById("horizontalSlider").style.display = "none";
		}
	}
	
	function adjustOpacity(value){	
		var opacity = value/100;
		if(selected_value == "map_mp14"){
		MP14Map.setOpacity(opacity);
		}
		if(selected_value == "map_pwb"){
		PW14Map.setOpacity(opacity);
		}
		if(selected_value == "map_lha"){
		LHAPMap.setOpacity(opacity);
		}
		if(selected_value == "map_sbud"){
			SBPUMap.setOpacity(opacity);
		}
		if(selected_value == "map_bhp"){
		BHPMap.setOpacity(opacity);
		}
		//added by lavanya satuluri 29 Aug 2014 AUDE
		if(selected_value == "wcb"){
		WaterColorMap.setOpacity(opacity);
		}
		//end lavanya satuluri 29 Aug 2014 AUDE
		if(selected_value == "osm"){
		StreetMap.setOpacity(opacity);
		}
		if(selected_value == "ollm"){
		LandLotMap.setOpacity(opacity);
		}
		if(selected_value == "map_agu"){
		AGUPMap.setOpacity(opacity);
		}
		if(selected_value == "iss"){
		InventorySalesMap.setOpacity(opacity);
		}
		document.getElementById('forSlider').innerHTML = Math.round(value);
		
	}
	
   /**
   * To show the list of maps to select/deselect   
   */
	function showMapList(){	
		var d_width = 500;
		var d_height = 600;
	
		$("#basemap")
		.dialog({
		"closeText": "",
		"resizable": true,
		"modal": true,
		"draggable":true,
		"width":d_width,
		"height":d_height,
		"close": function (event, ui) {
					populateDrDn(); //population of transparency drop down when the window is closed
			}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,
        "minimizeLocation" : "right",
        "icons" : {
          /*"close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-minusthick",    
          "restore" : "ui-icon-bullet"*/
        }
		});
		
		
		/** Check if buy cip is seleted then show Land Lot Map in the the Map list else hide **/
		if (buyMasterPlanFlag == 1) {			
			$('#tblMap tr:last-child').show();		
		}
		else {
			$('#tblMap tr:last-child').hide();		
		}
		}
 /**
   * To show the list of maps to select/deselect   
   */
   	var useragent = navigator.userAgent.toLowerCase();

	var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

	if(isAndroid) {
	function showMapListAndriod(){	
	$('#basemap_Andriod_Maps').css('display','block');
			var infoDiv = $('#basemap_Andriod_Maps');		
			var mapCanvas = $('#map-canvas');
			var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
			var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
			var infoHeight = infoDiv.height() / 2;	
			leftpos = leftpos + 40;
			toppos = toppos - infoHeight;
			infoDiv.css({
				'left': leftpos +'px',
				'top': toppos + 'px'
			});			
			infoDiv.show();
			var useragent = navigator.userAgent.toLowerCase();
			var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");
			if(isAndroid) {
			var infoDiv =$('#basemap_Andriod_Maps')
			 infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});

			}
		}
	}
	/* Hide Base Map Add by Venkat */
	var useragent = navigator.userAgent.toLowerCase();

	var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

	if(isAndroid) {
	function hideBasemap()
	{
	$('#basemap_Andriod_Maps').hide();
	}
	}
	/* Hide Base Map Legend Add by Venkat */
	var useragent = navigator.userAgent.toLowerCase();

	var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

	if(isAndroid) {
	function hideLegend()
	{
	$("#updatedmpmap-legend-andriod").hide();
	$("#mastermap-legend-andriod").hide();
	$("#pw-legend-andriod").hide();
	$("#lh-legend-andriod").hide();
	$("#bh-legend-andriod").hide();
	$("#agu-legend-andriod").hide();
	$("#sbud-legend-andriod").hide();
	$("#wcb-legend-andriod").hide();
	$("#streetMap-legend-andriod").hide();
	$("#landlotMap-legend-andriod").hide();
	}
	}
/*  Legend Added by venkat for Andriod*/
function getLegendandriod()
{
	if(selected_value == "map_updatedmp")
    { 		
			$("#updatedmpmap-legend-andriod").css('display','block');
			$('.updatedmpmap-content-outer').css('overflow-x','scroll');
			var outer=$('.updatedmpmap-content');
				outer.css({
				  'top': '-11px',
				  'left':'-5px'
				});
			var infoDiv = $('#updatedmpmap-legend-andriod');		
			var mapCanvas = $('#map-canvas');

			var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
			var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
				
			var infoHeight = infoDiv.height() / 2;	

			leftpos = leftpos + 40;
			toppos = toppos - infoHeight;

			infoDiv.css({
			'left': leftpos +'px',
			'top': toppos + 'px'
			});			
			infoDiv.show();
			var useragent = navigator.userAgent.toLowerCase();
			var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

			if(isAndroid) 
			{

			var infoDiv =$('#updatedmpmap-legend-andriod')
			infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
			  
			 }	
	}
	
    else if(selected_value == "map_mp14")
    {
		$("#mastermap-legend-andriod").css('display','block');
		$('.updatedmpmap-content-outer').css('overflow-x','scroll');
		var infoDiv = $('#mastermap-legend-andriod');		
		var mapCanvas = $('#map-canvas');
		var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
		var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
		var infoHeight = infoDiv.height() / 2;	
		leftpos = leftpos + 40;
		toppos = toppos - infoHeight;
		infoDiv.css({
			'left': leftpos +'px',
			'top': toppos + 'px'
			});			
		infoDiv.show();
		var useragent = navigator.userAgent.toLowerCase();
		var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");
		if(isAndroid) 
		{
		var infoDiv =$('#mastermap-legend-andriod')
		infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
	 
		}		
    }
    else if(selected_value == "map_pwb")
    {
		$("#pw-legend-andriod").css('display','block');
		$('.updatedmpmap-content-outer').css('overflow-x','scroll');
		var infoDiv = $('#pw-legend-andriod');
		var outer=$('.updatedmpmap-content');
				outer.css({
				  'top': '-6px',
				'left': '-25px'
				});		
		var mapCanvas = $('#map-canvas');
		var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
		var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
		var infoHeight = infoDiv.height() / 2;	
		leftpos = leftpos + 40;
		toppos = toppos - infoHeight;
		infoDiv.css({
			'left': leftpos +'px',
			'top': toppos + 'px'
			});			
		infoDiv.show();
		var useragent = navigator.userAgent.toLowerCase();
		var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");
		if(isAndroid) {
		var infoDiv =$('#pw-legend-andriod')
		infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
		  }		
    }
    else if(selected_value == "map_lha")
    {
		$("#lh-legend-andriod").css('display','block');
		$('.updatedmpmap-content-outer').css('overflow-x','scroll');
		var outer=$('.updatedmpmap-content');
				outer.css({
				'left': '-6px'
				});	
		var infoDiv = $('#lh-legend-andriod');		
		var mapCanvas = $('#map-canvas');
		var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
		var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
		var infoHeight = infoDiv.height() / 2;	
		leftpos = leftpos + 40;
		toppos = toppos - infoHeight;
		infoDiv.css({
			'left': leftpos +'px',
			'top': toppos + 'px'
			});			
		infoDiv.show();
		var useragent = navigator.userAgent.toLowerCase();
		var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");
		if(isAndroid) {
		var infoDiv =$('#lh-legend-andriod')
		infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
		 }
    }
    else if(selected_value == "map_bhp")
    {
		$("#bh-legend-andriod").css('display','block');
		$('.updatedmpmap-content-outer').css('overflow-x','scroll');
		var outer=$('.updatedmpmap-content');
				outer.css({
				  'top': '-4px',
				  'left':'-21px'
				});
		var infoDiv = $('#bh-legend-andriod');		
		var mapCanvas = $('#map-canvas');
		var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
		var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
		var infoHeight = infoDiv.height() / 2;	
		leftpos = leftpos + 40;
		toppos = toppos - infoHeight;
		infoDiv.css({
		'left': leftpos +'px',
		'top': toppos + 'px'
		});			
		infoDiv.show();
		var useragent = navigator.userAgent.toLowerCase();
		var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");
		if(isAndroid) {
		var infoDiv =$('#bh-legend-andriod')
		infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
		 }
    }
    else if(selected_value == "map_agu")
    {
	
		$("#agu-legend-andriod").css('display','block');
		$('.updatedmpmap-content-outer').css('overflow-x','scroll');
		var outer=$('.updatedmpmap-content');
				outer.css({
				  'top': '-14px'
				});
		var infoDiv = $("#agu-legend-andriod");	
		var mapCanvas = $('#map-canvas');
		var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
		var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
		var infoHeight = infoDiv.height() / 2;	
		leftpos = leftpos + 40;
		toppos = toppos - infoHeight;
		infoDiv.css({
		'left': leftpos +'px',
		'top': toppos + 'px'
				});			
		infoDiv.show();
		var useragent = navigator.userAgent.toLowerCase();
		var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

		if(isAndroid) {
		var infoDiv =$('#agu-legend-andriod')
		infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
		 }
    }
    else if(selected_value == "map_sbud")
    {
				$("#sbud-legend-andriod").css('display','block');
				$('.updatedmpmap-content-outer').css('overflow-x','scroll');
				var outer=$('.updatedmpmap-content');
				outer.css({
				  'top': '-16px',
				  'left': '-10px'
				});
				var infoDiv = $("#sbud-legend-andriod");	
				var mapCanvas = $('#map-canvas');

				var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
				var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
				
				var infoHeight = infoDiv.height() / 2;	

					leftpos = leftpos + 40;
					toppos = toppos - infoHeight;

				infoDiv.css({
					'left': leftpos +'px',
					'top': toppos + 'px'
				});			
				infoDiv.show();
				var useragent = navigator.userAgent.toLowerCase();
				var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

				if(isAndroid) {
				var infoDiv =$('#sbud-legend-andriod')
				infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
		 }
    }
		//added by lavanya atuluri 29 Aug 2014 AUDE
	else if(selected_value == "wcb")
    {
				$("#wcb-legend-andriod").css('display','block');
				//$('.updatedmpmap-content-outer').css('overflow-x','scroll');
				var infoDiv = $("#wcb-legend-andriod");
				var mapCanvas = $('#map-canvas');
				var outer=$('.updatedmpmap-content');
				outer.css({
				  'top': '14px',
				  'left':'30px'
				  
				});
				var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
				var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
				
				var infoHeight = infoDiv.height() / 2;	
				leftpos = leftpos + 40;
				toppos = toppos - infoHeight;

				infoDiv.css({
					'left': leftpos +'px',
					'top': toppos + 'px'
				});			
				infoDiv.show();
				var useragent = navigator.userAgent.toLowerCase();
				var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

				if(isAndroid) {
				var infoDiv =$('#wcb-legend-andriod')
				 infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
		 }
    }
	
	else if(selected_value == "osm")
    {
				$("#streetMap-legend-andriod").css('display','block');
				//$('.updatedmpmap-content-outer').css('overflow-x','scroll');
				var outer=$('.updatedmpmap-content');
				outer.css({
				  'top': '14px',
				  'left':'17px'
				});
				var infoDiv = $("#streetMap-legend-andriod");	
				var mapCanvas = $('#map-canvas');

				var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
				var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
				
				var infoHeight = infoDiv.height() / 2;	

					leftpos = leftpos + 40;
					toppos = toppos - infoHeight;

				infoDiv.css({
					'left': leftpos +'px',
					'top': toppos + 'px'
				});			
				infoDiv.show();
				var useragent = navigator.userAgent.toLowerCase();
				var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

				if(isAndroid) {
				var infoDiv =$('#streetMap-legend-andriod')
				infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
		 }
	 
    }
	else if(selected_value == "ollm")
    {
				$("#landlotMap-legend-andriod").css('display','block');
				//$('.updatedmpmap-content-outer').css('overflow-x','scroll');
				var outer=$('.updatedmpmap-content');
				outer.css({
				  'top': '14px',
				  'left':'17px'
				});
				var infoDiv = $("#landlotMap-legend-andriod");	
				var mapCanvas = $('#map-canvas');

				var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
				var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
				
				var infoHeight = infoDiv.height() / 2;	

					leftpos = leftpos + 40;
					toppos = toppos - infoHeight;

				infoDiv.css({
					'left': leftpos +'px',
					'top': toppos + 'px'
				});			
				infoDiv.show();
				var useragent = navigator.userAgent.toLowerCase();
				var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

				if(isAndroid) {
				var infoDiv =$('#landlotMap-legend-andriod')
				infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});
		 }
		
	}

	//Added by Bably 24 Oct 2014 for Inventory Sales Site 
	else if(selected_value == "iss")
    {
			$("#mastermap-legend-andriod").css('display','block');
			$('.updatedmpmap-content-outer').css('overflow-x','scroll');
			var infoDiv = $('#mastermap-legend-andriod');		
			var mapCanvas = $('#map-canvas');
			var leftpos = mapCanvas.offset().left + mapCanvas.width()/2;
			var toppos = mapCanvas.offset().top + mapCanvas.height()/2;
			var infoHeight = infoDiv.height() / 2;	
			leftpos = leftpos + 40;
			toppos = toppos - infoHeight;
			infoDiv.css({
					'left': leftpos +'px',
					'top': toppos + 'px'
				});			
			infoDiv.show();
			var useragent = navigator.userAgent.toLowerCase();
			var isAndroid = useragent.indexOf("android") > -1; //&& ua.indexOf("mobile");

			if(isAndroid) {
			var infoDiv =$('#mastermap-legend-andriod')
			 infoDiv.css({'left':'11px','top': '12px','display': 'block','z-index': '999','width': '90%'});

			}	
	}
}
/*  Legend End by venkat for Andriod*/
   /**
   * To show legend accordingly
   * Code by Yuzana Win
   */
 function getLegend() {
 
	
	if(selected_value == "map_updatedmp")
    { 		
		$("#updatedmpmap-legend")
		.dialog({
		"closeText": "", 
		"title" : 'Legend',
		"resizable": true,
		"modal": true,
		"draggable":true,
		"width":'420',
		"height":'600',
		"open": function (event, ui) {
		$('#mastermap-legend').css('overflow-x', 'auto'); //to hide the horizontal scrollbar
		$('#mastermap-legend').css('overflow-y', 'auto');}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,
        "minimizeLocation" : "right",
        "icons" : {
          /*"close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-minusthick",    
          "restore" : "ui-icon-bullet"*/
        }
		});
    }
	
    else if(selected_value == "map_mp14")
    { 		
		$("#mastermap-legend")
		.dialog({
		"closeText": "", 
		"title" : 'Legend',
		"resizable": true,
		"modal": true,
		"draggable":true,
		"width":'420',
		"height":'600',
		"open": function (event, ui) {
		$('#mastermap-legend').css('overflow-x', 'auto'); //to hide the horizontal scrollbar
		$('#mastermap-legend').css('overflow-y', 'auto');}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,
        "minimizeLocation" : "right",
        "icons" : {
          /*"close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-minusthick",    
          "restore" : "ui-icon-bullet"*/
        }
		});
    }
    else if(selected_value == "map_pwb")
    {
	  $("#pw-legend").dialog({
		"closeText": "", 
		title : 'Legend',
		resizable: true,
		modal: true,
		draggable:true,
		width:420,
		height:600,
		open: function (event, ui) {
		$('#pw-legend').css('overflow-x', 'hidden'); //to hide the horizontal scrollbar
		$('#pw-legend').css('overflow-y', 'auto');}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,
        "minimizeLocation" : "right",
        "icons" : {
		/*
          "close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-minusthick",    
          "restore" : "ui-icon-bullet"
		  */
        }	
		});
    }
    else if(selected_value == "map_lha")
    {
	  $("#lh-legend").dialog({
		"closeText": "", 
		title : 'Legend',
		resizable: true,
		modal: true,
		draggable:true,
		width:420,
		height:600,
		open: function (event, ui) {
		$('#lh-legend').css('overflow-x', 'hidden'); //to hide the horizontal scrollbar
		$('#lh-legend').css('overflow-y', 'auto');}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,
        "minimizeLocation" : "right",
        "icons" : {
		/*
          "close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-minusthick",    
          "restore" : "ui-icon-bullet"
		  */
        }	
		});
    }
    else if(selected_value == "map_bhp")
    {
	  $("#bh-legend").dialog({
		"closeText": "",
		title : 'Legend',
		resizable: true,
		modal: true,
		draggable:true,
		width:420,
		height:600,
		open: function (event, ui) {
		$('#bh-legend').css('overflow-x', 'auto'); //to hide the horizontal scrollbar
		$('#bh-legend').css('overflow-y', 'auto');}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,
        "minimizeLocation" : "right",
        "icons" : {
		/*
          "close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-minusthick",    
          "restore" : "ui-icon-bullet"
		  */
        }	
		});
    }
    else if(selected_value == "map_agu")
    {
	  $("#agu-legend").dialog({
		"closeText": "",
		title : 'Legend',
		resizable: true,
		modal: true,
		draggable:true,
		width:420,
		height:600,
		open: function (event, ui) {
		$('#agu-legend').css('overflow-x', 'auto'); //to hide the horizontal scrollbar
		$('#agu-legend').css('overflow-y', 'auto');}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,
        "minimizeLocation" : "right",
        "icons" : {
		/*
          "close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-minusthick",    
          "restore" : "ui-icon-bullet"
		  */
        }
		});
    }
    else if(selected_value == "map_sbud")
    {
	  $("#sbud-legend").dialog({
		"closeText": "",
		title : 'Legend',
		resizable: true,
		modal: true,
		draggable:true,
		width:420,
		height:600,
		open: function (event, ui) {
		$('#sbud-legend').css('overflow-x', 'auto'); //to hide the horizontal scrollbar
		$('#sbud-legend').css('overflow-y', 'auto');}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,
        "minimizeLocation" : "right",
        "icons" : {
		/*
          "close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-minusthick",    
          "restore" : "ui-icon-bullet"
		  */
        }
		});
    }
		//added by lavanya atuluri 29 Aug 2014 AUDE
	else if(selected_value == "wcb")
    {
	  $("#wcb-legend").dialog({
		"closeText": "",
		title : 'Legend',
		resizable: true,
		modal: true,
		draggable:true,
		width:500,
		height:100,
		open: function (event, ui) {
		$('#wcb-legend').css('overflow-x', 'hidden'); //to hide the horizontal scrollbar
		$('#wcb-legend').css('overflow-y', 'auto');}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,  
        "minimizeLocation" : "right",		
        "icons" : {
          /* "close" : "ui-icon-circle-close" */
        }
		});
    }
	//END lavanya satuluri 29 Aug 2014 AUDE
	
	else if(selected_value == "osm")
    {
	  $("#streetMap-legend").dialog({
		"closeText": "",
		title : 'Legend',
		resizable: false,
		modal: true,
		draggable:true,
		width:500,
		height:100
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,        
        "icons" : {
          /* "close" : "ui-icon-circle-close" */
        }
		});
    }
	else if(selected_value == "ollm")
    {
		$("#landlotMap-legend").dialog({
		"closeText": "",
		title : 'Legend',
		resizable: false,
		modal: true,
		draggable:true,
		width:500,
		height:100
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,        
        "icons" : {
          /* "close" : "ui-icon-circle-close" */
        }
		});
	}

	//Added by Bably 24 Oct 2014 for Inventory Sales Site 
	else if(selected_value == "iss")
    {
		$("#mastermap-legend")
		.dialog({
		"closeText": "", 
		"title" : 'Legend',
		"resizable": true,
		"modal": true,
		"draggable":true,
		"width":'420',
		"height":'600',
		"open": function (event, ui) {
		$('#mastermap-legend').css('overflow-x', 'auto'); //to hide the horizontal scrollbar
		$('#mastermap-legend').css('overflow-y', 'auto');}
		})
		.dialogExtend({
        "closable" : true,
        "maximizable" : false,
        "minimizable" : false,
        "minimizeLocation" : "right",
        "icons" : {
          /*"close" : "ui-icon-circle-close",
          "maximize" : "ui-icon-circle-plus",
          "minimize" : "ui-icon-minusthick",    
          "restore" : "ui-icon-bullet"*/
        }
		});
	}	
	 
  }

  /** to close legend  - added by lavanya satuluri 15 oct 2014 **/
  function closeLegend(){
  
  
  	if ($("#updatedmpmap-legend").is(':visible')) { 
	  $('#updatedmpmap-legend').dialog('close');
	}
	
	if ($("#mastermap-legend").is(':visible')) { 
	  $("#mastermap-legend").dialog('close');
	}
	if ($("#pw-legend").is(':visible')) { 	
	  $("#pw-legend").dialog('close');
	}
	if ($("#lh-legend").is(':visible')) { 
	  $("#lh-legend").dialog('close');
	}
	if ($("#bh-legend").is(':visible')) { 
	  $("#bh-legend").dialog('close');
	}
	if ($("#agu-legend").is(':visible')) { 
	  $("#agu-legend").dialog('close');
	}
	if ($("#sbud-legend").is(':visible')) { 
	  $("#sbud-legend").dialog('close');
	}
	if ($("#wcb-legend").is(':visible')) { 
	  $("#wcb-legend").dialog('close');
	}
	if ($("#streetMap-legend").is(':visible')) { 
	  $("#streetMap-legend").dialog('close');
	}
	if ($("#landlotMap-legend").is(':visible')) { 
	  $("#landlotMap-legend").dialog('close');
	}
  }
  /* Close Legend added  for Andriod*/
  function closeLegendAndriod(){
  
  
  	if ($("#updatedmpmap-legend-andriod").is(':visible')) { 
	  $('#updatedmpmap-legend-andriod').hide();
	}
	
	if ($("#mastermap-legend-andriod").is(':visible')) { 
	  $("#mastermap-legend-andriod").hide();
	}
	if ($("#pw-legend-andriod").is(':visible')) { 	
	  $("#pw-legend-andriod").hide();
	}
	if ($("#lh-legend-andriod").is(':visible')) { 
	  $("#lh-legend-andriod").hide();
	}
	if ($("#bh-legend-andriod").is(':visible')) { 
	  $("#bh-legend-andriod").hide();
	}
	if ($("#agu-legend-andriod").is(':visible')) { 
	  $("#agu-legend-andriod").hide();
	}
	if ($("#sbud-legend-andriod").is(':visible')) { 
	  $("#sbud-legend-andriod").hide();
	}
	if ($("#wcb-legend-andriod").is(':visible')) { 
	  $("#wcb-legend-andriod").hide();
	}
	if ($("#streetMap-legend-andriod").is(':visible')) { 
	  $("#streetMap-legend-andriod").hide();
	}
	if ($("#landlotMap-legend-andriod").is(':visible')) { 
	  $("#landlotMap-legend-andriod").hide();
	}
  }
  /*Ended By Venkat*/
  
  
/** avoid extra height on ipad when dragging the page **/   
  document.ontouchmove = function(event){
    //event.preventDefault();
}	

/** orientationchange event **/

$(window).on("orientationchange",function(){
	if(buyMasterPlanFlag == 1 || dwnldPlan == 1) {
		if(isIpad==true) {
			var divOpacityLeft = window.innerWidth - $("#rightDrawer").width() - $("#divOpacity").width() - 50 ;
			divOpacityLeft = divOpacityLeft + "px";					
			document.getElementById("divOpacity").style.left=divOpacityLeft;				
		}
	}	
})


//Orientatinchange - added by lavanya satuluri 20-Aug-2014 
	// $(window).on("orientationchange",function(){		

		// //Check if left drawer is open					
		// if (leftdrawerShowFlag == 1) {
			// var ZoomSliderLeft = $('#leftDrawer').width() + 16 + "px";
			// var HeaderLeft = $('#leftDrawer').width() + "px";
			
			// //reposition the zool slider and header
			// document.getElementById("map-canvas_zoom_slider").style.left = ZoomSliderLeft;						
			// document.getElementById("header").style.left= HeaderLeft;			
		// }
		
		// //ResizeDivSuggest();

	// }); 

// Resize - added by lavanya satuluri 20-Aug-2014
	// window.addEventListener("resize", function() {			
	// // //alert(2);
		// if (IsMobile == true) {
		 // //Check if left drawer is open				
			 // if (leftdrawerShowFlag == 1) {
				// var ZoomSliderLeft = $('#leftDrawer').width() + g_ZoomSilderLeft + "px";			
				 // var HeaderLeft = $('#leftDrawer').width() + "px";
			
				 // //reposition the zool slider and header
				 // document.getElementById("map-canvas_zoom_slider").style.left = ZoomSliderLeft;						
				 // document.getElementById("header").style.left= HeaderLeft;			
			 // }			
					
		 // }
	
	 // }, false);
	
	
	
	//-----------------------------------------------------------
		

/** show Menu for mobile **/
function ShowMobMenu() {
	if (MobMenuFlag == 0) {
		$(".MenuItemsOuter").show("slide", {direction : "up"}, "slow");			
		$("#MobMenu").attr('class', 'MobMenuTriangle');
		MobMenuFlag = 1;		
	}
	else
	{
		$(".MenuItemsOuter").hide("slide", {direction : "up"}, "slow");	
		$("#MobMenu").attr('class', 'MobMenuInvTriangle');
		MobMenuFlag = 0;
	}
}

function ShowMobAboutMP2014() {
	$(".MenuItemsOuter").hide("slide", {direction : "up"}, "slow");	
	MobMenuFlag = 0;	
	var link = "https://www.ura.gov.sg/uol/master-plan.aspx?p1=View-Master-Plan&p2=Introduction-to-Master-Plan";			
	window.open(link,'_tab');		
}

function ShowMobMap() {
	$(".MenuItemsOuter").hide("slide", {direction : "up"}, "slow");	
	MobMenuFlag = 0;
	showMapList ();
}

function ShowMobLegend() {
	$(".MenuItemsOuter").hide("slide", {direction : "up"}, "slow");	
	MobMenuFlag = 0;
	getLegend();
}