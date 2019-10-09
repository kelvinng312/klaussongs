<?php 

/**
Plugin Name: Builder
Description: This is a badass plugin
Author: <a href="https://webd4b.com">WEBD4B</a>
Version: 1.1 
**/

function addFiles(){
  // wp_enqueue_style(get_stylesheet_directory_uri() );
  wp_enqueue_style('bootstrap' , 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');
  wp_enqueue_style('fontii' , 'https://fonts.googleapis.com/css?family=Gayathri&display=swap');
  wp_enqueue_style('font-awesome' , 'https://use.fontawesome.com/releases/v5.8.2/css/all.css');
  wp_enqueue_style('jqueryUI' , 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css');
  wp_enqueue_style('jquerymobile' , 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.0.2/nouislider.min.css');
  wp_enqueue_script( 'jquerydd', 'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js' );

  wp_enqueue_script( 'bootstrap-js', 'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js' );
  wp_enqueue_script( 'jqueryddd', 'https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/14.0.2/nouislider.min.js' );
  wp_enqueue_script( 'wNumbjs', 'https://cdnjs.cloudflare.com/ajax/libs/wnumb/1.1.0/wNumb.min.js' );
  
  wp_enqueue_script( 'j-ui', 'https://code.jquery.com/ui/1.12.1/jquery-ui.js' );
  wp_enqueue_script( 'stupid', 'https://cdnjs.cloudflare.com/ajax/libs/stupidtable/1.1.3/stupidtable.min.js' );
  
  // jquery data table
  
  wp_enqueue_script( 'dataTablesjs', 'https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js');
  wp_enqueue_script( 'dataTablesselectjs', 'https://cdn.datatables.net/select/1.3.1/js/dataTables.select.min.js');

  wp_enqueue_style('dataTables' , 'https://cdn.datatables.net/1.10.20/css/jquery.dataTables.min.css');
  wp_enqueue_style('dataTables-select' , 'https://cdn.datatables.net/select/1.3.1/css/select.dataTables.min.css');

}

add_action( 'init', 'addFiles' );


function diamond_table_generator(){

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

// $sql = "SELECT wp_posts FROM wp_woocommerce_attribute_taxonomies"; 
// $sql = "SELECT post_title FROM wp_posts WHERE post_type = 'product' "; 
// $sql = "SELECT taxonomy FROM wp_term_taxonomy WHERE term_taxonomy_id = 19 "; 


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
$json_array = array();
$output .= '<div style="margin-bottom: 200px;"></div>

      <div class="container">
        <div class="row">
          <div class="col-lg-12 filt">
              <div class="shape-btn" id="shape-princess">
              <p>Princess</p>
              <img  src="wp-content/uploads/2019/09/1.png">
              </div>
              <div class="shape-btn" id="shape-round">
              <p>Round</p>
              <img  src="wp-content/uploads/2019/09/round.png">
              </div>
              <div class="shape-btn" id="shape-radiant">
              <p>Radiant</p>
              <img  src="wp-content/uploads/2019/09/2.png">
              </div>
              <div class="shape-btn" id="shape-heart">
              <p>Heart</p>
              <img  src="wp-content/uploads/2019/09/3.png">
              </div>
              <div class="shape-btn" id="shape-pear">
              <p>Pear</p>
              <img  src="wp-content/uploads/2019/09/4.png">
              </div>
              <div class="shape-btn" id="shape-marquise">
              <p>Marquise</p>
              <img  src="wp-content/uploads/2019/09/5.png">
              </div>
              <div class="shape-btn" id="shape-cushion">
              <p>Cushion</p>
              <img  src="wp-content/uploads/2019/09/6.png">
              </div>
              <div class="shape-btn" id="shape-asscher">
              <p>Asscher</p>
              <img  src="wp-content/uploads/2019/09/7.png">
              </div>
              <div class="shape-btn" id="shape-emerald">
              <p>Emerald</p>
              <img  src="wp-content/uploads/2019/09/8.png">
              </div>
              <div class="shape-btn" id="shape-oval">
              <p>Oval</p>
              <img  src="wp-content/uploads/2019/09/9.png">
              </div>
          </div>
        <div class="col-lg filt">
          <div class="label-slider-filter">price</div>
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
            <div class="label-slider-filter">clarity</div>
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

if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {
      $json_array[] = $row; 
    }
    ?>

    
<script type="text/javascript">

  var myData = <?php echo json_encode($json_array) ?>;

// change myData to show only columns you need
let filtered = myData.map(row => 
Object.fromEntries(
  Object.entries(row).filter(it => { 
  let key = it[0]; 
  // add the product id and the product image path to it to make it happen bro
  return ['Carat','Clarity','Shape', 'Price', 'Color', 'Cut','Symmetry','Report', 'link_view', 'Polish' ].indexOf(key) >= 0 
    })
  )
);


</script>
    

    <?php
  // json_encode($json_array);


}else {
    echo "0 results";
}
$conn->close();


  return $output; 
}


add_shortcode( 'diandmaker', 'diamond_table_generator' );


?>


