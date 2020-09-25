$(document).ready(function(){
	$("#filter").click(function(){
		var json_url = "https://raw.githubusercontent.com/Arcadier/API-Changelog/master/Postman%20Collections/Arcadier_API_v2.0.json";
		$.getJSON(json_url, function(result){
			toastr.success("Check the console log", "Success!");
			console.log(result.info.name); 
			console.log(result.item[0].item[0].name); 
		});
	});
	
	$('.opener.toggle-menu').click(function(e) {
            $('.mobile_nav').toggle();
        
        });
	
	addPostmanButton();
	changeViewButton();
	
	function addPostmanButton(){
		(function (p,o,s,t,m,a,n) {!p[s] && (p[s] = function (){(p[t] || (p[t] = [])).push(arguments);});!o.getElementById(s+t) && o.getElementsByTagName("head")[0].appendChild(((n = o.createElement("script")), (n.id = s+t), (n.async = 1), (n.src = m), n));}
		(window, document, "_pm", "PostmanRunObject", "https://run.pstmn.io/button.js"));
	}
	
	function changeViewButton(){
		var timer = setInterval(function(){
			var view_btn = document.querySelector(".wrapper > header > li.view > a");
			if(view_btn){
				console.log("exists");
				view_btn.href = "https://apiv2.arcadier.com";
				view_btn.target = "_blank";
				view_btn.innerHTML = "Go to Postman";
				clearInterval(timer);
			}
		}, 100);
	}
});


function changeTitles(){
	var title = document.querySelector(".wrapper > .subhead > h1 > a");
	title.innerHTML = "API Changelog";
}

function import_toastr(){
	var i=0;
	var toast_timer = setInterval(function(){
		if(i == 2){
			var toastr_js = document.createElement('script');
			toastr_js.src = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"
			toastr_js.type = 'text/javascript';
			document.getElementsByTagName('head')[0].appendChild(toastr_js);
			clearInterval(toast_timer);
		}
		i++;
	}, 50);
}

function import_toastr_css(){
	var i=0;
	var timer = setInterval(function(){
		if(i == 2){
			var style = document.createElement('link');
			style.href = "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css"
			style.type = 'text/css';
			style.rel = "stylesheet";
			document.getElementsByTagName('head')[0].appendChild(style);
			clearInterval(timer);
		}
		i++;
	}, 50);
}

function hideFooter(){
	//done by css
}

