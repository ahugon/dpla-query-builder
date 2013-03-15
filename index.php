<html>

	<head>
		<title>Library Observatory &middot; Powered by metaLAB (at) Harvard & DPLA</title>
		<link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,700' rel='stylesheet' type='text/css'>
		<link href="css/bootstrap.css" rel="stylesheet" type="text/css" />
		<!--<link href="css/bootstrap-responsive.css" rel="stylesheet" type="text/css" />-->
		<link href="css/custom.css" rel="stylesheet" type="text/css" />
		<link href="css/nav.css" rel="stylesheet" type="text/css" />
		<script src="http://d3js.org/d3.v3.min.js"></script>
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.ui.core.min.js"></script>
		<script src='js/jquery.ui.widget.min.js'></script>
		<script src='js/jquery.ui.mouse.min.js'></script>
		<script src='js/jquery.ui.draggable.min.js'></script>
		<script src='js/jquery.ui.droppable.min.js'></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/custom.js"></script>
		
		<script type="text/javascript" src="d3/d3.js"></script>
		<script type="text/javascript" src="d3/d3.layout.js"></script>
		
		<link href="css/visualization.css" rel="stylesheet" type="text/css" />
		<script src="visualization.js"></script>
	</head>
	
	<body>
		
		<div id="scroll-to-top" title="Scroll to top"></div>
		
		<div id="wrap" class="container">
			<div class="breathing-room row header">
				<div class="span12">
					<div class="float-left"><h1>Library Observatory</h1></div>
					<div class="float-right"><img src="img/dpla.png" class="square" /></div>
					<div class="float-right"><img src="img/logo.gif" class="square" /></div>
				</div>
			</div>	
			
			<div class="section">
				<div class="row breathing-room">
					<div class="span12">
						<div class="large"><b>Library Observatory</b> is an open visualization toolkit for visualizing and analyzing the broadest possible range of open library data, courtesy of the <a href="http://dp.la/dev/wiki/Main_Page">DPLA API</a>.</div>
						<br><br>
						<img src="img/visualization.jpg" />
						<div class="small centered-text">Two comparative timelines showing accessions of non-English items at Harvard over time correlated with dates of publication. (<i>Source: <a href="http://metalab.harvard.edu/2012/08/library-observatory-an-open-community-facility-for-exploring-library-collections-and-services/">metaLAB blog</a> </i>)</div>
					</div>
				</div>
				<div class="row breathing-room">
					<div class="span4">
						<div class="padded-right">
							<div class="centered-text">
								<h2>Explore</h2>
							</div>
							Craft powerful queries using an intuitive interface to ask meaningful questions of the DPLA's collections. 
						</div>
					</div>
					<div class="span4">
						<div class="padded-right">
							<div class="centered-text">
								<h2>Discover</h2>
							</div>
							Effortlessly visualize the answers to your queries and uncover interesting trends in the DPLA's rich data and meta-data.
						</div>
					</div>
					<div class="span4">
						<div class="padded-right">
							<div class="centered-text">
								<h2>Engage</h2>
							</div>
							Engage and re-engage with your results; drill deeper into the data with great flexibility and accessibility.
						</div>
					</div>
				</div>
				<div class="row">
					<div class="span12">
						<div class="tabbable">
							<ul class="nav nav-tabs">
								<li class="active"><a href="#semantic" data-toggle="tab">Semantic search</a></li>
								<li><a href="#visual" data-toggle="tab">Visual search</a></li>
							</ul>
							<div class="tab-content">
								<div class="tab-pane active" id="semantic">
									<div class="question">
										<h3>&ldquo;Show all records...</h3>
										<section class="where">
											<div class="condition field">
												where 
												<select class="span2">
													<option>title</option>
													<option>description</option>
													<option>subject</option>
													<option>creator</option>
													<option>type</option>
													<option>publisher</option>
													<option>format</option>
													<option>rights</option>
													<option>contributor</option>
												</select> is <input type="text" class="span4" placeholder="e.g. Divina Commedia" />
											</div>
											<div class="add-field">
												<a>+ add another field</a>
											</div>
										</section>
										<section class="temporal">
											<div class="condition when">
												dated 
												<select class="span2">
													<option>before</option>
													<option>after</option>
												</select> <input type="text" class="span2" placeholder="e.g. 1321" />
											</div>
											<div class="add-when">
												<a>+ add temporal constraint</a>
											</div>
										</section>
										<section class="location">
											<div class="condition where">
												with a location of <input type="text" class="span2" placeholder="e.g. Italy" />
											</div>
										</section>
										<section class="sort">
											<div class="condition sort">
												sorted by <select class="span2">
															<option value="date.begin">date</option>
															<option value="title">title</option>
															<option value="subject.name">name</option>
														</select>.&rdquo;
											</div>
										</section>
										<section>
											<a id="semantic-submit" class="btn btn-red">Show results</a> <a id="semantic-clear" class="btn">Clear constraints</a> &middot; Show <input id="sem_results_per_page" class="span1" type="text" value="75" /> results per page
											<div class="float-right">
												<a id="semantic-download" class="btn btn-inverse">Download results</a>
											</div>
										</section>
									</div>
								</div>
								<div class="tab-pane" id="visual">
									<div class="question">
										<h3>Visualize your query</h3>
										<p>Drag search constraints from the menu on the right to the sandbox on the left.  Then, customize the constraints and submit your query once you've finished.</p>
										<section>
											<div class="float-left" id="dragspace"></div>
											<div class="float-right centered-text" id="drag-sources">
												<h3>Constraint Menu</h3>
												<div class="drag-source" id="field-source">Field constraint</div>
												<div class="drag-source" id="temporal-source">Temporal constraint</div>
												<div class="drag-source" id="location-source">Location constraint</div>	
												<div class="drag-source" id="sort-source">Sort-by constraint</div>
											</div>
											<div class="clear"></div>
										</section>
										<section>
											<a id="visual-submit" class="btn btn-red">Show results</a> <a id="visual-clear" class="btn">Clear constraints</a> &middot; Show <input id="vis_results_per_page" class="span1" type="text" value="75" /> results per page
											<div class="float-right">
												<a id="visual-download" class="btn btn-inverse">Download results</a>
											</div>
										</section>
									</div>
								</div>
							</div>
						</div>
						
						<div class="result-wrapper">
							<div class="upper-right"><a id="clear-results">clear results</a></div>
							<h3>Results</h3>
							Jump to page <input id="jump" type="text" class="span1" value="1" /> (Total pages of results: <span id="total_pages">0</span>)
							<div id="results"></div>
							<ul class="pager">
								<li class="previous">
									<a>&larr; Previous page</a>
								</li>
								<li class="next">
									<a>Next page &rarr;</a>
								</li>
							</ul>
						</div>
						
						<div class="viz">
							<div id="controls">

								<div class="question">
									<div class=" row-fluid">
									
									<div class="span6">
										<input type="text" style="width:500px" id="query"></input>
									</div>
									<div class="span2 querybox">
									<a id="newquery" class="btn btn-red btn-large" style="margin-left: 50px; margin-top: -10px;">Visualize</a>
									</div>
										<div id="loading" class="hidden span2  querybox">loading...</div>

								</div>

								<div class="row-fluid">
								<div class="span10">
									Query info: 
									<span id="query-info"></span>
								</div>

								</div>

								<div class="row-fluid">
									<div class="span3">
									<h3>1st sort</h3>  	
									<select id="var1" class="variable_menu">
										<option value="format"><a href="#">Format</a></option>
										<option value="publisher"><a href="#">Publisher</a></option>
										<option value="date" ><a href="#">Date</a></option>
										<option value="collection" selected><a href="#">Collection</a></option>
										<option value="contributor" ><a href="#">DPLA Contributor</a></option>
										<option value="nada"><a href="#">Nada</a></option>

									</select>
								 </div>
								 
								 
								 <div class="span3">
									<h3>2nd sort</h3>  	
									<select id="var2" class="variable_menu">
										<option value="format"><a href="#" selected>Format</a></option>
										<option value="publisher"><a href="#">Publisher</a></option>
										<option value="date"><a href="#">Date</a></option>
										<option value="collection"><a href="#">Collection</a></option>
										<option value="contributor" ><a href="#">DPLA Contributor</a></option>
										<option value="nada"><a href="#">Nada</a></option>

									</select>
								  </div>
								  
								  <div class="span3">
									<h3>3rd sort</h3>  	
									<select id="var3" class="variable_menu">
										<option value="format"><a href="#">Format</a></option>
										<option value="publisher"><a href="#">Publisher</a></option>
										<option value="date"><a href="#" selected>Date</a></option>
										<option value="collection"><a href="#">Collection</a></option>
										<option value="contributor" ><a href="#">DPLA Contributor</a></option>
										<option value="nada"><a href="#">Nada</a></option>
									</select>
									</div>
									
									</div>
									
								</div>


							</div>
							<div id="body">
							</div>

						</div>
					</div>
				</div>
			</div>
			
			<footer>
				<div class="float-left"><a href="http://metalab.harvard.edu">metaLAB (at) Harvard</a> &middot; <a href="http://cyber.law.harvard.edu/">Berkman Center for Internet & Society</a> &middot; <a href="http://dp.la/">DPLA</a></div>
				<div class="float-right">Site by <a href="http://metalab.harvard.edu">metaLAB (at) Harvard</a></div>
			</footer>
		</div>		
	</body>
</html>
