

// table variables

var filtered;

// selected row IDs
var rowsSelected = [];
var rowsViewed = [];

let savedRowsSelected = sessionStorage['rowsSelected'];
if (savedRowsSelected != undefined) 
  rowsSelected = JSON.parse(savedRowsSelected);

let savedRowsViewed = sessionStorage['rowsViewed'];
if (savedRowsViewed != undefined) 
  rowsViewed = JSON.parse(sessionStorage['rowsViewed']);


// table filter
var filterFunctions = {};

const moneyFormat = wNumb({
            decimals: 0,
            thousand: ',',
            prefix: '$'
          });

// functions
function initSliders() {
  // find min/max of price, carat
  let minPrice = Infinity;
  let maxPrice = 0;
  let minCarat = Infinity;
  let maxCarat = 0;

  filtered.forEach(
    r => {
      if (r.Price < minPrice) 
        minPrice = r.Price;
      if (r.Price > maxPrice) 
        maxPrice = r.Price;
      if (r.Carat < minCarat) 
        minCarat = r.Carat;
      if (r.Carat > maxCarat) 
        maxCarat = r.Carat;
    }
  );

  minPrice = Math.floor((minPrice / 100)) * 100 - 100;
  maxPrice = Math.ceil((maxPrice / 100)) * 100 + 1000;

  // price slider
  let priceSliderUI = noUiSlider.create(document.getElementById('price'), {
    start: [minPrice, maxPrice],
    connect: false,
    animate: false,
    range: {
      'min': minPrice,
      'max': maxPrice
    },
    tooltips: true,
    format: wNumb({
      decimals: 0,
      thousand: ',',
      prefix: '$ '
    })
  });


  // carat slider
  let caratSliderUI = noUiSlider.create(document.getElementById('carat'), {
    start: [minCarat, maxCarat],
    connect: false,
    animate: false,
    range: {
      'min': minCarat,
      'max': maxCarat
    },
    tooltips: true
  });

  // color slider
  window.shapeSymbol = ['Princess', 'Round', 'Radiant', 'Heart', 'Pear', 'Marquise', 'Cushion', 'Asscher', 'Emerald', 'Oval'];
  let shapesliderUI = noUiSlider.create(document.getElementById('shape'), {
    start: [shapeSymbol[0], shapeSymbol[shapeSymbol.length - 1]],
    step: 1,
    range: {
      'min': [0],
      'max': [shapeSymbol.length - 1]
    },
    format: {
      // 'to' the formatted value. Receives a number.
      to: function(value) {
        // console.log("to: ", value);
        // console.log("to: parseInt: ", Math.round(value));
        // console.log("to: symbol : ", shapeSymbol[Math.round(value)]);

        return shapeSymbol[Math.round(value)];
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from: function(value) {
        console.log("from: ", value);

        let index = shapeSymbol.findIndex((v) => v === value);
        return index;
      }
    },
    tooltips: false,
    // pips: {
    //   mode: 'steps',
    //   density: 1,
    //   format: {
    //     // 'to' the formatted value. Receives a number.
    //     to: function(value) {
    //       return shapeSymbol[value];
    //     },
    //     // 'from' the formatted value.
    //     // Receives a string, should return a number.
    //     from: function(value) {
    //       let index = shapeSymbol.findIndex((v) => v === value);
    //       return index;
    //     }
    //   },
    // }

    pips: {
      mode: 'steps',
      density: 10,
      format: {
        // 'to' the formatted value. Receives a number.
        to: function(value) {
          return shapeSymbol[parseInt(value)];
        },
        // 'from' the formatted value.
        // Receives a string, should return a number.
        from: function(value) {
          let index = shapeSymbol.findIndex((v) => v === value);
          return index;
        }
      },
    }
  });


  // color slider
  window.colorSymbol = ['J', 'I', 'H', 'G', 'F', 'E', 'D'];
  let colorsliderUI = noUiSlider.create(document.getElementById('color'), {
    start: [colorSymbol[0], colorSymbol[colorSymbol.length - 1]],
    step: 1,
    range: {
      'min': [0],
      'max': [colorSymbol.length - 1]
    },
    format: {
      // 'to' the formatted value. Receives a number.
      to: function(value) {
        return colorSymbol[parseInt(value)];
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from: function(value) {
        let index = colorSymbol.findIndex((v) => v === value);
        return index;
      }
    },
    tooltips: false,
    pips: {
      mode: 'steps',
      density: 10,
      format: {
        // 'to' the formatted value. Receives a number.
        to: function(value) {
          return colorSymbol[value];
        },
        // 'from' the formatted value.
        // Receives a string, should return a number.
        from: function(value) {
          let index = colorSymbol.findIndex((v) => v === value);
          return index;
        }
      },
    }
  });


  // clarity slider
  window.claritySymbol = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'];
  let claritySliderUI = noUiSlider.create(document.getElementById('clarity'), {
    start: [claritySymbol[0], claritySymbol[claritySymbol.length - 1]],
    step: 1,
    range: {
      'min': [0],
      'max': [claritySymbol.length - 1]
    },
    format: {
      // 'to' the formatted value. Receives a number.
      to: function(value) {
        return claritySymbol[value];
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from: function(value) {
        let index = claritySymbol.findIndex((v) => v === value);
        return index;
      }
    },
    tooltips: false,
    pips: {
      mode: 'steps',
      density: 20,
      format: {
        // 'to' the formatted value. Receives a number.
        to: function(value) {
          return claritySymbol[value];
        },
        // 'from' the formatted value.
        // Receives a string, should return a number.
        from: function(value) {
          let index = claritySymbol.findIndex((v) => v === value);
          return index;
        }
      },
    }
  });


  // polish slider
  window.polishSymbol = ['Good', 'Very Good', 'Excellent'];
  let polishSliderUI = noUiSlider.create(document.getElementById('polish'), {
    start: [polishSymbol[0], polishSymbol[polishSymbol.length - 1]],
    step: 1,
    range: {
      'min': [0],
      'max': [polishSymbol.length - 1]
    },
    format: {
      // 'to' the formatted value. Receives a number.
      to: function(value) {
        return polishSymbol[value];
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from: function(value) {
        let index = polishSymbol.findIndex((v) => v === value);
        return index;
      }
    },
    tooltips: false,
    pips: {
      mode: 'steps',
      density: 20,
      format: {
        // 'to' the formatted value. Receives a number.
        to: function(value) {
          return polishSymbol[value];
        },
        // 'from' the formatted value.
        // Receives a string, should return a number.
        from: function(value) {
          let index = polishSymbol.findIndex((v) => v === value);
          return index;
        }
      },
    }
  });


  // report slider
  window.reportSymbol = ['GIA', 'IGI', 'HRD'];
  let reportSliderUI = noUiSlider.create(document.getElementById('report'), {
    start: [reportSymbol[0], reportSymbol[reportSymbol.length - 1]],
    step: 1,
    range: {
      'min': [0],
      'max': [reportSymbol.length - 1]
    },
    format: {
      // 'to' the formatted value. Receives a number.
      to: function(value) {
        return reportSymbol[value];
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from: function(value) {
        let index = reportSymbol.findIndex((v) => v === value);
        return index;
      }
    },
    tooltips: false,
    pips: {
      mode: 'steps',
      density: 20,
      format: {
        // 'to' the formatted value. Receives a number.
        to: function(value) {
          return reportSymbol[value];
        },
        // 'from' the formatted value.
        // Receives a string, should return a number.
        from: function(value) {
          let index = reportSymbol.findIndex((v) => v === value);
          return index;
        }
      },
    }
  });


  // symmetry slider
  window.symmetrySymbol = ['Good', 'Very Good', 'Excellent'];
  let symmetrySliderUI = noUiSlider.create(document.getElementById('symmetry'), {
    start: [symmetrySymbol[0], symmetrySymbol[symmetrySymbol.length - 1]],
    step: 1,
    range: {
      'min': [0],
      'max': [symmetrySymbol.length - 1]
    },
    format: {
      // 'to' the formatted value. Receives a number.
      to: function(value) {
        return symmetrySymbol[value];
      },
      // 'from' the formatted value.
      // Receives a string, should return a number.
      from: function(value) {
        let index = symmetrySymbol.findIndex((v) => v === value);
        return index;
      }
    },
    tooltips: false,
    pips: {
      mode: 'steps',
      density: 10,
      format: {
        // 'to' the formatted value. Receives a number.
        to: function(value) {
          return symmetrySymbol[value];
        },
        // 'from' the formatted value.
        // Receives a string, should return a number.
        from: function(value) {
          let index = symmetrySymbol.findIndex((v) => v === value);
          return index;
        }
      },
    }
  });

  // event handlers

  const cleanPrice = /[$, ]/g;
  priceSliderUI.on("change",
    function(r) {
      
      let range = r;
      range[0] = parseFloat(range[0].replace(cleanPrice, ''));
      range[1] = parseFloat(range[1].replace(cleanPrice, ''));

      filterFunctions['price'] = (data) => {
        var value = moneyFormat.from(data[4]);
        var isInRange = range[0] <= value && value <= range[1];
        return isInRange;
      }

      masterFilterAndRender();

    }
  );

  caratSliderUI.on("change",
    function(r) {
      let range = r;
      range[0] = parseFloat(range[0]);
      range[1] = parseFloat(range[1]);

      filterFunctions['carat'] = (data) => {
        
        var value = parseFloat(data[1]);
        var isInRange = range[0] <= value && value <= range[1];
        return isInRange;
      }

      masterFilterAndRender();

    }
  );


  shapesliderUI.on("change",
    function(r) {

      // console.log("change", r);

      let range = r;
      range[0] = shapeSymbol.indexOf(range[0]);
      range[1] = shapeSymbol.indexOf(range[1]);
      
      filterFunctions['shape'] = (data) => {

        var value = shapeSymbol.indexOf(data[3]);
        var isInRange = range[0] <= value && value <= range[1];

        // if(isInRange)
        //   debugger

        return isInRange;
      }

      masterFilterAndRender();

    }
  );

  colorsliderUI.on("change",
    function(r) {

      let range = r;
      range[0] = colorSymbol.indexOf(range[0]);
      range[1] = colorSymbol.indexOf(range[1]);
      
      filterFunctions['color'] = (data) => {

        var value = colorSymbol.indexOf(data[2]);
        var isInRange = range[0] <= value && value <= range[1];
        return isInRange;
      }

      masterFilterAndRender();

    }
  );

  claritySliderUI.on("change",
    function(r) {

      let range = r;
      range[0] = claritySymbol.indexOf(range[0]);
      range[1] = claritySymbol.indexOf(range[1]);
      
      filterFunctions['clarity'] = (data) => {

        var value = claritySymbol.indexOf(data[8]);
        var isInRange = range[0] <= value && value <= range[1];
        return isInRange;
      }

      masterFilterAndRender();

    }
  );


  polishSliderUI.on("change",
    function(r) {

      let range = r;
      range[0] = polishSymbol.indexOf(range[0]);
      range[1] = polishSymbol.indexOf(range[1]);
      
      filterFunctions['polish'] = (data) => {

        var value = polishSymbol.indexOf(data[9]);
        var isInRange = range[0] <= value && value <= range[1];
        return isInRange;
      }

      masterFilterAndRender();

    }
  );

  reportSliderUI.on("change",
    function(r) {

      let range = r;
      range[0] = reportSymbol.indexOf(range[0]);
      range[1] = reportSymbol.indexOf(range[1]);
      
      filterFunctions['report'] = (data) => {

        var value = reportSymbol.indexOf(data[7]);
        var isInRange = range[0] <= value && value <= range[1];
        return isInRange;
      }

      masterFilterAndRender();

    }
  );

  symmetrySliderUI.on("change",
    function(r) {

      let range = r;
      range[0] = symmetrySymbol.indexOf(range[0]);
      range[1] = symmetrySymbol.indexOf(range[1]);
      
      filterFunctions['symmetry'] = (data) => {

        var value = symmetrySymbol.indexOf(data[6]);
        var isInRange = range[0] <= value && value <= range[1];
        return isInRange;
      }

      masterFilterAndRender();

    }
  );
};


// custom filtering fuction
$.fn.dataTable.ext.search.push(
  function(settings, data, dataIndex) {

    var rowId = data[0];

    if (settings.nTable.id == 'results-table') {

      let matched = true;

      // match fail if one of filters is failed.
      for (var key in filterFunctions) {
        if (!filterFunctions[key](data)) {
          matched = false;
          break;
        }
      }

      return matched;

    } else if (settings.nTable.id == 'recently-viewed-table') {
      
      // debugger;

      if ($.inArray(rowId, rowsViewed) != -1)
        return true;
      return false;

    } else if (settings.nTable.id == 'comparison-table') {
      
      if ($.inArray(rowId, rowsSelected) != -1)
        return true;
      return false;

    }

    return true;
  }
);

// refresh the table according to the filter
function masterFilterAndRender() {

  var table = $('#results-table').DataTable();

  table.draw();

  // results table count
  $('#total-results').html( resultsTable.rows({filter:'applied'}).count() );
  $('#recently-views').html( recentlyViewedTable.rows({filter:'applied'}).count() );
  $('#comparison-views').html( comparisonTable.rows({filter:'applied'}).count() );
}


var editor; // use a global for the submit and return data rendering in the examples

function initTable() {

  // results table
  window.resultsTable = $('#results-table').DataTable({

    "ordering": false,
    "info": false,

    /* paging mode */
    "dom": 'tp',


    /* scroll mode */

    // "paging": false,
    // "scrollY": "500px",
    // "deferRender": true,
    // "scroller": true,

    "columns": [
      { 
        "title": "", 
        "data": "Product ID", 
        "defaultContent": "",
        "orderable": false,
        "className": 'dt-body-center',
        "width": "1%",
        "render": function(data, type, row, meta) {
          if (type === 'display')
            return '<input type="checkbox" />';

          return data;
        }
      },
      { "title": "Carat", "data": "Carat" },
      { "title": "Color", "data": "Color" },
      { "title": "Shape", "data": "Shape" },

      {
        "title": "Price",
        "data": "Price",
        "render": function(data, type, row, meta) {
          const moneyFormat = wNumb({
            decimals: 0,
            thousand: ',',
            prefix: '$'
          });

          return moneyFormat.to(data);
        }
      },

      { "title": "Cut", "data": "Cut" },
      { "title": "Symmetry", "data": "Symmetry" },
      { "title": "Report", "data": "Report" },
      { "title": "Clarity", "data": "Clarity" },
      { "title": "Polish", "data": "Polish" },
      {
        "title": "Link",
        "data": "link_view",
        "render": function(data, type, row, meta) {
          return '<a href="' + data + '">View</a>';
        }
      }
    ],

    "rowCallback": function (row, data, dataIndex) {
      var rowId = data['Product ID'];

      // if row ID is in the list of selected row IDs
      if ($.inArray(rowId, rowsSelected) != -1) {
        $(row).find('input[type="checkbox"]').prop('checked', true);
      } else {
        $(row).find('input[type="checkbox"]').prop('checked', false);
      }
    },

    "data": filtered
  });


  // recently viewed table
  window.recentlyViewedTable = $('#recently-viewed-table').DataTable({

    "ordering": false,
    "info": false,

    /* paging mode */
    "dom": 'tp',


    /* scroll mode */

    // "paging": false,
    // "scrollY": "500px",
    // "deferRender": true,
    // "scroller": true,

    "columns": [
      { 
        "title": "", 
        "data": "Product ID", 
        "defaultContent": "",
        "orderable": false,
        "className": 'dt-body-center',
        "width": "1%",
        "render": function(data, type, row, meta) {
          if (type === 'display')
            return '<input type="checkbox" />';

          return data;
        }
      },
      { "title": "Carat", "data": "Carat" },
      { "title": "Color", "data": "Color" },
      { "title": "Shape", "data": "Shape" },

      {
        "title": "Price",
        "data": "Price",
        "render": function(data, type, row, meta) {
          const moneyFormat = wNumb({
            decimals: 0,
            thousand: ',',
            prefix: '$'
          });

          return moneyFormat.to(data);
        }
      },

      { "title": "Cut", "data": "Cut" },
      { "title": "Symmetry", "data": "Symmetry" },
      { "title": "Report", "data": "Report" },
      { "title": "Clarity", "data": "Clarity" },
      { "title": "Polish", "data": "Polish" },
      {
        "title": "Link",
        "data": "link_view",
        "render": function(data, type, row, meta) {
          return '<a href="' + data + '">View</a>';
        }
      }
    ],

    "rowCallback": function (row, data, dataIndex) {
      var rowId = data['Product ID'];

      // if row ID is in the list of selected row IDs
      if ($.inArray(rowId, rowsSelected) != -1) {
        $(row).find('input[type="checkbox"]').prop('checked', true);
      } else {
        $(row).find('input[type="checkbox"]').prop('checked', false);
      }
    },

    "data": filtered
  });


  // comparison table
  window.comparisonTable = $('#comparison-table').DataTable({

    "ordering": false,
    "info": false,

    /* paging mode */
    "dom": 'tp',


    /* scroll mode */

    // "paging": false,
    // "scrollY": "500px",
    // "deferRender": true,
    // "scroller": true,

    "columns": [
      { 
        "title": "", 
        "data": "Product ID", 
        "defaultContent": "",
        "orderable": false,
        "className": 'dt-body-center',
        "width": "1%",
        "render": function(data, type, row, meta) {
          if (type === 'display')
            return '<input type="checkbox" />';

          return data;
        }
      },
      { "title": "Carat", "data": "Carat" },
      { "title": "Color", "data": "Color" },
      { "title": "Shape", "data": "Shape" },

      {
        "title": "Price",
        "data": "Price",
        "render": function(data, type, row, meta) {
          const moneyFormat = wNumb({
            decimals: 0,
            thousand: ',',
            prefix: '$'
          });

          return moneyFormat.to(data);
        }
      },

      { "title": "Cut", "data": "Cut" },
      { "title": "Symmetry", "data": "Symmetry" },
      { "title": "Report", "data": "Report" },
      { "title": "Clarity", "data": "Clarity" },
      { "title": "Polish", "data": "Polish" },
      {
        "title": "Link",
        "data": "link_view",
        "render": function(data, type, row, meta) {
          return '<a href="' + data + '">View</a>';
        }
      }
    ],

    "rowCallback": function (row, data, dataIndex) {
      var rowId = data['Product ID'];

      // if row ID is in the list of selected row IDs
      if ($.inArray(rowId, rowsSelected) != -1) {
        $(row).find('input[type="checkbox"]').prop('checked', true);
      } else {
        $(row).find('input[type="checkbox"]').prop('checked', false);
      }
    },

    "data": filtered
  });

  // initial filter
  masterFilterAndRender();


  // link event handler
  $('table tbody').on('click', 'tr a', function(e) {
    var table = $(this).closest('table').DataTable();
    var $row = $(this).closest('tr');
    var data = table.row($row).data();

    var rowId = data['Product ID'];

    var index = $.inArray(rowId, rowsViewed);
    if (index === -1) {
      rowsViewed.push(rowId);
      sessionStorage.setItem('rowsViewed', JSON.stringify(rowsViewed));

      recentlyViewedTable.draw();
      $('#recently-views').html(rowsViewed.length);
    }
  });

  
  // checkbox event handler
  $('#results-table tbody, #recently-viewed-table tbody, #comparison-table tbody').on('change', 'input[type="checkbox"]', function(e) {
    var $row = $(this).closest('tr');

    var table = $(this).closest('table').DataTable();
    // get row data
    var data = table.row($row).data();
    
    // get row ID
    var rowId = data['Product ID'];

    // check whether row ID is in the listof selected row IDs
    var index = $.inArray(rowId, rowsSelected);

    // if checkbox is checked and row ID is not in list of selected row IDs
    if (this.checked && index === -1) {
      rowsSelected.push(rowId);
    } else if (!this.checked && index !== -1) {
      rowsSelected.splice(index, 1);
    }
    sessionStorage.setItem('rowsSelected', JSON.stringify(rowsSelected));

    // redraw the tables
    resultsTable.draw();
    recentlyViewedTable.draw();
    comparisonTable.draw();    

    $('#comparison-views').html(rowsSelected.length);

    // prevent click event from propagating to parent
    e.stopPropagation();
  });
}


$(document).ready(function() {
  // get data from wp
  filtered = myData.map(row =>
    Object.fromEntries(
      Object.entries(row).filter(it => { 
        let key = it[0]; 
        // add the product id and the product image path to it to make it happen bro
        return ['Product ID', 'Carat','Clarity','Shape', 'Price', 'Color', 'Cut','Symmetry','Report', 'link_view', 'Polish' ].indexOf(key) >= 0  }
      )
    )
  );


  filtered.forEach(
  r => {
    r.Carat = parseFloat(r.Carat);
    r.Price = parseFloat(r.Price.replace(/[$,]/g, ""));
  }
  );

  // tabs
  $("#tabs").tabs({
    event: "mouseover"
  });

  // slider
  initSliders();

  // table
  initTable();
});