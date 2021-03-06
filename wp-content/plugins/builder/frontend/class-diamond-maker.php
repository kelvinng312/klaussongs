<?php
defined( 'ABSPATH' ) or die( "Access denied !" );

/**
 * Plugins frontend
 *
 */
class Builder_DiamondMaker {

	/**
	 *
	 * @var shortcode name
	 */
	var $shortcode = 'diamond-maker';

	/**
	 * add actions, filters and shortcode
	 *
	 */
	public function setup () {
		// add scripts - added to the header
		add_action( 'wp_enqueue_scripts',
			array(
				$this,
				'add_scripts'
			) );

		// enable shortcode
		add_shortcode( $this->shortcode,
			array(
				$this,
				'enable_shortcode'
			) );
	}

	/**
	 * callback to process shortcode
	 *
	 * @param array $atts
	 * 				properties set in shortcode by user
	 * @param string $content
	 *				content of the shortcode
	 * @return string - contents
	 */
	function enable_shortcode ( $atts, $content ) {
		$servername = "localhost";
		$username = "i2042577_wp4";
		$password = "D.2EX5bxhCAIoQaxFqB96";
		$dbname = "i2042577_wp4";

		// Create connection
		$conn = new mysqli($servername, $username, $password, $dbname);
		// Check connection
		if ($conn->connect_error) {
		    die("Connection failed: " . $conn->connect_error);
		}

	    $sql = "SELECT 
		    p.ID AS 'Product ID', 
		    p.post_title AS 'Product Name', 
		    GROUP_CONCAT(IF(tt.taxonomy LIKE 'pa_carat%', t.name, NULL)) AS 'Carat',
		    GROUP_CONCAT(IF(tt.taxonomy LIKE 'pa_clarity%', t.name, NULL)) AS 'Clarity',
		    GROUP_CONCAT(IF(tt.taxonomy LIKE 'pa_shape%', t.name, NULL)) AS 'Shape', 
		  	GROUP_CONCAT(IF(tt.taxonomy LIKE 'pa_cut%', t.name, NULL)) AS 'Cut',
		    GROUP_CONCAT(IF(tt.taxonomy LIKE 'pa_symmetry%', t.name, NULL)) AS 'Symmetry',
		    GROUP_CONCAT(IF(tt.taxonomy LIKE 'pa_color%', t.name, NULL)) AS 'Color',
		    GROUP_CONCAT(IF(tt.taxonomy LIKE 'pa_polish%', t.name, NULL)) AS 'Polish',
		    GROUP_CONCAT(IF(tt.taxonomy LIKE 'pa_report%', t.name, NULL)) AS 'Report',
		    IF(meta.meta_key LIKE '_regular_price%', meta.meta_value, NULL) AS 'Price', 
		    p.guid AS link_view
		 FROM wp_posts AS p 
		 INNER JOIN wp_term_relationships AS tr ON p.ID = tr.object_id 
		 INNER JOIN wp_term_taxonomy AS tt ON tr.term_taxonomy_id = tt.term_id 
		    AND (tt.taxonomy LIKE 'pa_carat%' 
		      OR tt.taxonomy LIKE 'pa_clarity%' 
		      OR tt.taxonomy LIKE 'pa_shape%' 
		      OR tt.taxonomy LIKE 'pa_polish%' 
		      OR tt.taxonomy LIKE 'pa_report%' 
		      OR tt.taxonomy LIKE 'pa_color%' 
		      OR tt.taxonomy LIKE 'pa_symmetry%' 
		      OR tt.taxonomy LIKE 'pa_cut%') 
		 INNER JOIN wp_terms AS t ON tr.term_taxonomy_id = t.term_id 
		 INNER JOIN wp_postmeta AS meta ON p.ID = meta.post_id 
		 WHERE p.post_type = 'product'AND p.post_status ='publish' AND (meta.meta_key LIKE '_regular_price%')
		 GROUP BY p.ID";

		$result = $conn->query($sql);
		$conn->close();

		
		if ($result->num_rows > 0) {
        	$json_array = array();
		    while($row = $result->fetch_assoc()) {
		      $json_array[] = $row; 
		    }

		    ?>
			<script type="text/javascript">
			  var myData = <?php echo json_encode($json_array) ?>;
			</script>
			<?php
			
		} else {
		    echo "0 results";
		}

		// output string
		$output = '
	      <div class="container">
	        <div class="row">
	          <div class="col-lg filt">
	            <div class="label-slider-filter">Shape</div>
	            <div id="shape"></div>
	          </div>
	        </div>
	        <div class="row">
	          <div class="col-lg filt">
	            <div class="label-slider-filter">Price</div>
	            <div id="price"></div>
	          </div>
	        </div>
	        <div class="row">
	          <div class="col-lg filt">
	            <div class="label-slider-filter">Carat</div>
	            <div id="carat"></div>
	          </div>
	          <div class="col-lg filt">
	            <div class="label-slider-filter">Color</div>
	            <div id="color"></div>
	          </div>
	        </div>
	        <div class="row">
	          <div class="col-lg filt">
	            <div class="label-slider-filter">Clarity</div>
	            <div id="clarity"></div>
	          </div>
	          <div class="col-lg filt">
	            <div class="label-slider-filter">Polish</div>
	            <div id="polish"></div>
	          </div>
	        </div>
	        <div class="row">
	          <div class="col-lg filt">
	            <div class="label-slider-filter">Report</div>
	            <div id="report"></div>
	          </div>
	          <div class="col-lg filt">
	            <div class="label-slider-filter">Symmetry</div>
	            <div id="symmetry"></div>
	          </div>
	        </div>
	      </div>
	      ';

      
		$output .= '<div class="container">
              <div class="row diamond-wrapper">
                <div class="col-lg-12">
                  <div id="tabs">
                    <ul>
                      <li>
                        <a href="#results-tab">
                          <span>Results (</span>
                          <span id="total-results">0</span>
                          <span>)</span>
                        </a>
                      </li>
                      <li>
                        <a href="#recently-viewed-tab">
                          <span>Recently Viewed (</span>
                          <span id="recently-views">0</span>
                          <span>)</span>
                        </a>
                      </li>
                      <li>
                        <a href="#comparison-tab">
                          <span>Comparison (</span>
                          <span id="comparison-views">0</span>
                          <span>)</span>
                        </a>
                      </li>
                    </ul>
                    <div id="results-tab">
                      <table id="results-table" class="display" width="100%"></table>
                    </div>
                    <div id="recently-viewed-tab">
                      <table id="recently-viewed-table" class="display" width="100%"></table>
                    </div>
                    <div id="comparison-tab">
                      <table id="comparison-table" class="display" width="100%"></table>
                    </div>
                  </div>
                </div>
              </div>
            </div>';		

		return trim( $output );
	}

	/**
	 * register and enqueue scripts
	 *
	 */
	function add_scripts () {
		global $post;

		if ( false == isset( $post ) ) {
			return;
		}

		// enqueue script only if shortcode is present in post/page
		if ( has_shortcode( $post->post_content, $this->shortcode ) ) {

			// enqueue css
			wp_enqueue_style('bootstrap' , 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');
			wp_enqueue_style('fontii' , 'https://fonts.googleapis.com/css?family=Gayathri&display=swap');
			wp_enqueue_style('font-awesome' , 'https://use.fontawesome.com/releases/v5.8.2/css/all.css');
			wp_enqueue_style('jqueryUI' , 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css');
			wp_enqueue_style('jquerymobile' , 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.0.2/nouislider.min.css');
			wp_enqueue_style('dataTables' , 'https://cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css');
			wp_enqueue_style('dataTables-select' , 'https://cdn.datatables.net/select/1.3.1/css/select.dataTables.min.css');

			// enqueue script
			wp_enqueue_script( 'jquerydd', 'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js' );
			wp_enqueue_script( 'bootstrap-js', 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js' );
			wp_enqueue_script( 'jqueryddd', 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.0.2/nouislider.min.js' );
			wp_enqueue_script( 'wNumbjs', 'https://cdnjs.cloudflare.com/ajax/libs/wnumb/1.1.0/wNumb.min.js' );
			wp_enqueue_script( 'j-ui', 'https://code.jquery.com/ui/1.12.1/jquery-ui.js' );
			wp_enqueue_script( 'stupid', 'https://cdnjs.cloudflare.com/ajax/libs/stupidtable/1.1.3/stupidtable.min.js' );
			wp_enqueue_script( 'dataTablesjs', 'https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js');
			wp_enqueue_script( 'dataTablesselectjs', 'https://cdn.datatables.net/select/1.3.1/js/dataTables.select.min.js');

			wp_enqueue_script( 'dm_script', BUILDER_URL . 'assets/js/diamond-maker.js' );
		}
	}
}