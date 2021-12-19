
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

App = {
    loading: false,
    contracts: {},
    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({
                    /* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({
                /* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async () => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
        console.log(App.account)
    },

    loadContract: async () => {
        // Create a JavaScript version of the smart contract
        const patients = await $.getJSON('Patients.json')
        console.log(patients)
        App.contracts.Patients = TruffleContract(patients)
        App.contracts.Patients.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        App.patients = await App.contracts.Patients.deployed()
    },

    render: async () => {
        // Prevent double render
        if (App.loading) {
          return
        }
    
        // Update app loading state
        App.loading = true
    
        // Render Account
        $('#account').html("Connected with: "+App.account)
    
        // Render Patients
        //await App.renderPatients() UNCOMMENT THIS TO SHOW BLOCKCHAIN
    
        // Update loading state
        App.loading = false
      },

      renderPatients: async () => {
        // Load the total patient count from the blockchain
        const patientCount = await App.patients.patientCount()
        console.log(patientCount)
        const $patientTemplate = $('.patientTemplate')
        const blPatList = document.querySelector('#blPat-list');
        // Render out each patient with a new patient template
        for (var i = 1; i <= patientCount; i++) {
            // Fetch the patient data from the blockchain
            const patient = await App.patients.patientDetails(i)
            const patientID = patient[0].toNumber()
            const patientName = patient[1]
            const patientAddr = patient[2]
            const patientEmail = patient[3]
            const patientTel = patient[4]
            const patientWallet = patient[5]
            
            let li = document.createElement('li');
            let name = document.createElement('span');
            let add = document.createElement('span');
            add.style.display = "block"
            let email = document.createElement('span');
            email.style.display = "block"
            let tel = document.createElement('span');
            tel.style.display = "block"
            let wallet = document.createElement('span');
            wallet.style.display = "block"

            li.setAttribute('data-id', patientID);

            name.textContent = patientName
            add.textContent = patientAddr
            email.textContent = patientEmail
            tel.textContent = patientTel
            wallet.textContent = patientWallet
            li.appendChild(name);
            li.appendChild(add);
            li.appendChild(email);
            li.appendChild(tel);
            li.appendChild(wallet);

            blPatList.appendChild(li);
        }
    },

    createPatient: async (name, address, email, tel, wallet) => {
        App.loading = true
        await App.patients.createPatient(name, address, email, tel, wallet, {from: App.account})
        window.location.reload()
      }
    


}

$(() => {
    $(window).load(() => {
        App.load()
    })
})