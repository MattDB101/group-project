App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../patients.json', function(data) {
      var patientRow = $('#patientRow');
      var patientTemplate = $('#patientTemplate');

      for (i = 0; i < data.length; i ++) {
        patientTemplate.find('.panel-title').text(data[i].name);
        patientTemplate.find('img').attr('src', data[i].picture);
        patientTemplate.find('.patient-age').text(data[i].age);
        patientTemplate.find('.patient-phone').text(data[i].phone);
        patientTemplate.find('.patient-gp').text(data[i].gp);
        patientTemplate.find('.btn-view').attr('data-id', data[i].id);

        patientRow.append(patientTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
	if (window.ethereum) {
	  App.web3Provider = window.ethereum;
	  try {
		// Request account access
		await window.ethereum.request({ method: "eth_requestAccounts" });;
	  } catch (error) {
		// User denied account access...
		console.error("User denied account access")
	  }
	}
	// Legacy dapp browsers...
	else if (window.web3) {
	  App.web3Provider = window.web3.currentProvider;
	}
	// If no injected web3 instance is detected, fall back to Ganache
	else {
	  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
	}
	web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Viewing.json', function(data) {
	  // Get the necessary contract artifact file and instantiate it with @truffle/contract
	  var ViewingArtifact = data;
	  App.contracts.Viewing = TruffleContract(ViewingArtifact);

	  // Set the provider for our contract
	  App.contracts.Viewing.setProvider(App.web3Provider);

	  // Use our contract to retrieve and mark the adopted pets
	  return App.markViewed();
	});

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-view', App.handleView);
  },

  markViewed: function() {
    var viewInstance;

	App.contracts.Viewing.deployed().then(function(instance) {
	  viewInstance = instance;

	  return viewInstance.getViewers.call();
	}).then(function(viewers) {
	  for (i = 0; i < viewers.length; i++) {
		if (viewers[i] !== '0x0000000000000000000000000000000000000000') {
		  $('.panel-patient').eq(i).find('button').text('Viewed').attr('disabled', true);
		}
	  }
	}).catch(function(err) {
	  console.log(err.message);
	});
  },

  handleView: function(event) {
    event.preventDefault();

    var patientId = parseInt($(event.target).data('id'));

    var viewInstance;

	web3.eth.getAccounts(function(error, accounts) {
	  if (error) {
		console.log(error);
	  }

	  var account = accounts[0];

	  App.contracts.Viewing.deployed().then(function(instance) {
		viewInstance = instance;

		// Execute adopt as a transaction by sending account
		return viewInstance.viewing(patientId, {from: account});
	  }).then(function(result) {
		return App.markViewed();
	  }).catch(function(err) {
		console.log(err.message);
	  });
	});
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
