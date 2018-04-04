/*
 * © Copyright T-Matic Grupa Computerplus Sp. z o.o. 2017
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */
// @name         activitiesCharts
// @version      0.1
// @author       T-Matic Grupa Computerplus Sp. z o.o.

if (typeof(dojo) != "undefined") {
	require(['dojo/domReady'], function (domReady) {
		try {
			work();
		} catch (e) {
			alert("Exception occurred in helloWorld: " + e);
		}
	});
}

Gantt = {
	appUrl: "[appUrl]",
	chartsTab: {
		"gantt": {
			id: 0,
			liId: 'ganttli',
			navPositionHref: '#activitypage_gantt,',
			navPanelId: 'actNavPanel',
			label: "activityGanttHeader",
			position: 2,
			urlKey: 'gantt',
			mainContentDivId: 'activitypage',
			chartDivId: 'lotusContentGantt',
			pageName: '/activitygantt.xhtml',
			iframename: 'iframegantt'

		},
		"hr": {
			id: 1,
			liId: 'hrli',
			navPositionHref: '#activitypage_hr,',
			navPanelId: 'actNavPanel',
			label: "activityGanttHeader",
			position: 3,
			urlKey: 'hr',
			mainContentDivId: 'activitypage',
			chartDivId: 'lotusContentGantt',
			pageName: '/activityhr.xhtml',
			iframename: 'iframegantt'

		}
	},
	labels: ["Gantt Chart", "Human Resources", "My To Do Chart",
		"Global Human Resources", "Human Resources"]
};

function work() {
	console.log("work");
	require(["dojo/router", "dojo/dom-construct"], function (router, domConstruct) {
		router.register("activitypage:id", function (event) {
			activityUrl = event.params.id;
			activityUrlTmp = activityUrl.replace(/,/g, "");
			activityId = activityUrlTmp.substr(activityUrlTmp.length - 36);
			// Navigation
			addNavPosition("gantt", activityId);
			addIFrame(["gantt"], activityUrl, activityId);
			addNavPosition("hr", activityId);
			addIFrame(["hr"], activityUrl, activityId);
		});
		router.startup();
	});
}

function addNavPosition(type, activityId) {
	var chart = Gantt.chartsTab[type];
	var chartli = document.getElementById(chart.liId);
	var nav = null;
	var x = 0;

	if (chartli !== null) {
		alink = chartli.getElementsByTagName('a');
		alink[0].href = chart.navPositionHref + activityId;
	} else {
		Util.waitFor(function () {
			var nav = document.getElementById(chart.navPanelId);
			if (nav !== null) {
				var chartNav = nav.getElementsByTagName('ul');
				if (chartNav !== null && chartNav.length > 0) {
					var newLi = document.createElement('li');
					newLi.id = chart.liId;
					newLi.innerHTML = '<a href="' + chart.navPositionHref + activityId + '">' + getLabel(chart) + '</a>';

					chartNav[0].insertBefore(newLi,
						chartNav[0].childNodes[chart.position]);
					if (activityUrl.indexOf(chart.urlKey) > -1) {
						setNavPositionActive(chart);
					} else {
						setNavPositionInActive(chart, activityId, activityUrl);
					}
				}

			}
		}, "#" + chart.navPanelId + " ul");

	}
}

function addIFrame(typeTab, activityUrl, activityId) {
	var urlContains = false;
	var type = typeTab[0];
	for (var i = 0; i < typeTab.length; i++) {
		if (activityUrl.indexOf(Gantt.chartsTab[typeTab[i]].urlKey) > -1) {
			urlContains = true;
			type = typeTab[i];
		} else {
			var chartli = document.getElementById(Gantt.chartsTab[typeTab[i]].liId);
			if (chartli !== null) {
				chartli.className = "";
			}
		}
	}
	var chart = Gantt.chartsTab[type];
	var mainDiv = document.getElementById(chart.mainContentDivId);
	var lotusContentDiv = mainDiv.getElementsByClassName('lotusContent')[0];
	var lotusContentChartDiv = document.getElementById(chart.chartDivId);
	if (urlContains) {
		var src = prepareUrlToApp(chart.pageName, activityId);
		if (lotusContentChartDiv !== null) {
			lotusContentChartDiv.style.display = "block";
			getGanttChart(lotusContentChartDiv, src);
		} else {
			lotusContentChartDiv = document.createElement('div');
			lotusContentChartDiv.className = "lotusContent";
			lotusContentChartDiv.id = chart.chartDivId;
			getGanttChart(lotusContentChartDiv, src);
			mainDiv.appendChild(lotusContentChartDiv);
		}
		lotusContentDiv.style.display = "none";
		setNavPositionActive(chart);
	} else {
		if (lotusContentDiv !== null) {
			lotusContentDiv.style.display = "block";
		}
		if (lotusContentChartDiv !== null) {
			lotusContentChartDiv.style.display = "none";
		}
		setNavPositionInActive(chart, activityId, activityUrl);
	}
}

function getGanttChart(element, src) {
	var fileUrl = src;
	var chartEL = document.getElementsByClassName("ganttContainer")[0];
	if (chartEL) {
		chartEL.parentElement.innerHTML = "";
	}
	element.innerHTML = "";

	require(["dojo/dom-construct"], function (domConstruct) {
		var iframe = domConstruct.create("iframe", {
				src: src,
				height: "800px",
				frameborder: "0",
				style: "width:100%;"
			});
		domConstruct.place(iframe, element);
	});
}

function prepareUrlToApp(pagename, activityId) {
	var src = Gantt.appUrl + pagename;
	src += "?fullscreen=false";
	src += activityId !== null ? '&activityid=' + activityId : "";
	src += "&lang=" + document.documentElement.lang;
	src += "&val=" + new Date().getTime();
	return src;
}

function getLabel(chart) {
	var lang = "";
	if (navigator.userAgent.indexOf('MSIE') != -1) {
		lang = navigator.browserLanguage.split("-")[0];
	} else {
		lang = navigator.language.split("-")[0];
	}
	var label = Gantt.labels[chart.id];
	return label;
}

function setNavPositionActive(chart) {
	var chartli = document.getElementById(chart.liId);

	if (chartli !== null) {
		chartli.className = "lotusSelected";
		var actNav = document.getElementById(chart.navPanelId);
		var liNav = actNav.getElementsByTagName('ul');
		var liNavFirst = liNav[0].getElementsByTagName('li');
		liNavFirst[0].style.borderLeftColor = "transparent";
		var liNavFirstA = liNavFirst[0].getElementsByTagName('a');
		liNavFirstA[0].style.background = "inherit";
		liNavFirstA[0].style.border = "inherit";
		liNavFirstA[0].style.color = "inherit";
		liNavFirstA[0].style['box-shadow'] = "inherit";
		liNavFirstA[0].style['font-weight'] = "inherit";
	}

}

function setNavPositionInActive(chart, activityId, activityUrl) {
	var chartli = document.getElementById(chart.liId);

	if (activityUrl == ("," + activityId) || activityUrl == ("t,default") || activityUrl == ("t") || activityUrl == (",myactivities")) {
		var actNav = document.getElementById(chart.navPanelId);
		var liNav = actNav.getElementsByTagName('ul');
		if (liNav !== null) {
			if (liNav.length>0) {
				var liNavFirst = liNav[0].getElementsByTagName('li');
				liNavFirst[0].style.borderLeftColor = "#4178be";
				var liNavFirstA = liNavFirst[0].getElementsByTagName('a');
				liNavFirst[0].styleName = "";
				liNavFirstA[0].style.background = "";
				liNavFirstA[0].style.border = "";
				liNavFirstA[0].style.color = "";
				liNavFirstA[0].style['box-shadow'] = "";
				liNavFirstA[0].style['font-weight'] = "";
			}
		}
	}
	if (chartli !== null) {
		chartli.className = "";
	}
}

var Util = {
	waitFor: function (callback, elXpath, elXpathRoot, maxInter, waitTime) {
		require(["dojo/dom-construct"], function (domConstruct) {
			if (!elXpathRoot)
				var elXpathRoot = dojo.body();
			if (!maxInter)
				var maxInter = 10000; // number of intervals before expiring
			if (!waitTime)
				var waitTime = 1; // 1000=1 second
			if (!elXpath)
				return;
			var waitInter = 0; // current interval
			var intId = setInterval(function () {
					if (++waitInter < maxInter && !dojo.query(elXpath, elXpathRoot).length)
						return;

					clearInterval(intId);
					if (waitInter >= maxInter) {
						console.log("**** WAITFOR [" + elXpath + "] WATCH EXPIRED!!! interval " + waitInter + " (max:" + maxInter + ")");
					} else {
						console.log("**** WAITFOR [" + elXpath + "] WATCH TRIPPED AT interval " + waitInter + " (max:" + maxInter + ")");
						callback();
					}
				}, waitTime);
		});
	}
};
