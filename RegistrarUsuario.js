'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // Cargar la configuración de la red
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Crear un nuevo cliente CA para interactuar con la CA.
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    //Crear un nuevo sistema de ficheros basado en una billetera para gestionar las identidades
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Revisar si el usuario ya está añadido
    const userIdentity = await wallet.get('appUser');
    if (userIdentity) {
      console.log('An identity for the user "appUser" already exists in the wallet');
      return;
    }

    // Revisar si el usuario administrador ya está añadido
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log('An identity for the admin user "admin" does not exist in the wallet');
      console.log('Run the enrollAdmin.js application before retrying');
      return;
    }

    // Construir un objeto para llevar a cabo la autentificación con la CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Registrar el usuario, añadir el usuario e importar la nueva identidad en la billetera
    const secret = await ca.register(
      {
        affiliation: 'org1.department1',
        enrollmentID: 'appUser',
        role: 'client'
      },
      adminUser
    );
    const enrollment = await ca.enroll({
      enrollmentID: 'appUser',
      enrollmentSecret: secret
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: 'Org1MSP',
      type: 'X.509'
    };
    await wallet.put('appUser', x509Identity);
    console.log('Successfully registered and enrolled admin user "appUser" and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to register user "appUser": ${error}`);
    process.exit(1);
  }
}

main();
