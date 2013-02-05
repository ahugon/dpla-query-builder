
$(document).ready(function() {

	initializeSemanticSearch();
	initializeVisualSearch();
	initializeResults();
	
	refreshHandlers("visual");
	refreshHandlers("semantic");
	
});

function hideParent(child)
{
	child.parent().fadeOut(400, function() { $(this).remove(); });
}

function clearResults()
{
	$("div#results").slideUp(400, function() { $(this).html(""); });
}

function initializeResults()
{
	/* clear results link */
	$("a#clear-results").click(function(event) {
	
		clearResults();
	
	});
}

function initializeDropSpace(el)
{
	el.droppable({
		accept: "div.drag-source",
		drop: function( event, ui ) { addConstraint(ui.draggable); }
	});
}

function initializeDragItem(el)
{
	el.draggable({
		start: function(event, ui) {  },
		stop: function(event, ui) {  },
		cancel: "a.ui-icon", // clicking an icon won't initiate dragging
		revert: "invalid", // when not dropped, the item will revert back to its initial position
		containment: $("#dragspace"), // stick to demo-frame if present
		helper: "clone",
		cursor: "move",
		cursorAt: { top: 15, left: 95 }
	});
}

function addConstraint(el)
{
	var id = el.attr("id");
	
	var newConstraint = $("<div class='active-constraint'>");
	var contents = "";
	var typeOfConstraint = "";
	
	if(id == "field-source")
	{
		contents += '<select class="span2">' + 
						'	<option>title</option>' + 
						'	<option>description</option>' + 
						'	<option>subject</option>' + 
						'	<option>dplaContributor</option>' + 
						'	<option>creator</option>' + 
						'	<option>type</option>' + 
						'	<option>publisher</option>' + 
						'	<option>format</option>' + 
						'	<option>rights</option>' + 
						'	<option>contributor</option>' + 
						'	<option>isPartOf</option>' + 
					'</select> = <input type="text" class="span2" placeholder="e.g. Dante" />';
		typeOfConstraint = "field";
	}
	else if(id == "temporal-source")
	{
		contents += 'Dated <select class="span2">' +
						'	<option>before</option>' +
						'	<option>after</option>' +
					'</select> <input type="text" class="span2" placeholder="e.g. 1321" />';
		typeOfConstraint = "when";
	}
	else if(id == "location-source")
	{
		contents += 'Location of <input type="text" class="span2" placeholder="e.g. Italy" />';
		typeOfConstraint = "where";
	}
	
	newConstraint.html(contents);
	newConstraint.addClass(typeOfConstraint);
	
	var remove = $('<button class="close animated">&times</button>');
	remove.click(function(event) { hideParent($(this)); submit("visual"); });
	
	newConstraint.append(remove);
	
	$("#dragspace").append(newConstraint);
	
	// handle dynamic recombobulating
	refreshHandlers("visual");
}

function initializeVisualSearch()
{
	/* make the source items draggable */
	$(".drag-source").each(function() { initializeDragItem($(this)); });
	
	/* make the dragspace droppable-into */
	initializeDropSpace($("#dragspace"));
	
	/* clear constraints button */
	$("a#visual-clear").click(function() {
	
		// trigger the "remove" event for each constraint
		$("div.active-constraint button").each(function() { $(this).click(); });
	
	});
	
	/* submit form link */
	$("#visual a#visual-submit").click(function(event) {
	
		submit("visual");
	
	});
	
}

function initializeSemanticSearch()
{
	/* "remove" constraint link */
	$("#semantic div.condition a").click(function(event) { hideParent($(this)); });
	
	/* "add new xyz" constraint link */
	$("#semantic div.add-field a, #semantic div.add-when a").click(function(event) {
		
		var parent = $(this).parent();
		var section = parent.parent();
		
		var dropdown = "and ";
		var conditionType = "";
		
		if(section.hasClass("where"))
		{
			dropdown += '<select class="span2">' + 
						'	<option>title</option>' + 
						'	<option>description</option>' + 
						'	<option>subject</option>' + 
						'	<option>dplaContributor</option>' + 
						'	<option>creator</option>' + 
						'	<option>type</option>' + 
						'	<option>publisher</option>' + 
						'	<option>format</option>' + 
						'	<option>rights</option>' + 
						'	<option>contributor</option>' + 
						'	<option>isPartOf</option>' + 
						'</select> is <input type="text" class="span4" placeholder="e.g. Divina Commedia" />&nbsp;';
			conditionType = "field";
		}
		else if(section.hasClass("temporal"))
		{
			dropdown += '<select class="span2">' +
						'	<option>before</option>' +
						'	<option>after</option>' +
						'</select> <input type="text" class="span2" placeholder="e.g. 1321" />&nbsp;';
			conditionType = "when";
		}
		
		// generate constraint
		var condition = $('<div class="condition">');
		condition.addClass(conditionType);
		condition.html(dropdown);
								
		// generate corresponding 'remove' link and assign it the proper event handler; then tack it onto our condition div.
		var remove = $('<a>remove</a>');
		remove.click(function(event) { hideParent($(this)); });
		condition.append(remove);
		
		// insert the new condition after the other conditions but before the "+ add new xyz" link 
		condition.insertBefore(parent);
		
		// handle dynamic recombobulating
		refreshHandlers("semantic");
		
	});
	
	/* clear constraints link */
	$("#semantic a#semantic-clear").click(function(event) {
		
		// trigger the "remove" event for each added constraint
		$("div.condition a").each(function() { $(this).click(); });
		
		// empty the text fields
		$('input[type="text"]').each(function() { $(this).val(""); });
		
		// reset the dropdowns
		$("select").each(function() { $(this).find('option:first').attr('selected', 'selected'); });
		
	});
	
	/* submit form link */
	$("#semantic a#semantic-submit").click(function(event) {
	
		submit("semantic");
	
	});
	
}

function refreshHandlers(vis_or_sem)
{
	var subdiv = "";
	if(vis_or_sem == "visual") { subdiv = "div.active-constraint"; }
	else if(vis_or_sem == "semantic") { subdiv = "div.condition"; }
	
	$("." + subdiv + " select, ." + subdiv + " input").change(function(event) {
		
		submit(vis_or_sem);
	
	});
}

function submit(vis_or_sem)
{
	clearResults();
	
	var fields = "";
	var field_values = "";
	var temporal = "";
	var dates = "";
	var location = "";
	
	var subdiv = "";
	if(vis_or_sem == "visual") { subdiv = "div.active-constraint"; }
	else if(vis_or_sem == "semantic") { subdiv = "div.condition"; }
	
	var num_conditions = $("#" + vis_or_sem + " " + subdiv).length;
	var count_conditions = 0;
	
	$("#" + vis_or_sem + " " + subdiv).each(function() {
	
		var typeOfConstraint = "";
		
		// handle fields
		if($(this).hasClass("field"))
		{
			fields += $(this).find("select").val() + "|";
			field_values += $(this).find('input[type="text"]').val() + "|";
		}
		
		// handle before/after dates
		else if($(this).hasClass("when"))
		{
			temporal += $(this).find("select").val() + "|";
			dates += $(this).find('input[type="text"]').val() + "|";
		}
		
		// handle locations
		else if($(this).hasClass("where"))
		{
			location += $(this).find('input[type="text"]').val();
		}
		
		// keep track of how many we've processed out of total # of constraints
		count_conditions++;
		
		if(count_conditions == num_conditions)
		{
			$.post("query.php", {fields:fields, field_values:field_values, temporal:temporal, dates:dates, location:location}, function(data) {
			
				var q = data.query;
				var results = data.results;
				
				$("div#results").html("<strong>Your query was: </strong> " + q + "<hr>" + results);
				$("div#results").slideDown();
			
			}, "json");
		}
	
	});
}