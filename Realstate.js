
'use strict';

const { Contract } = require('fabric-contract-api');

class RealEstate extends Contract {
  async initLedger(ctx) {
    console.info('============= INICIO : Inicializar ledger ===========');
    const properties = [
      {
        id: 'e43c551rff326f639489a21312rt1229io23e5aed',
        nombre: 'Thonglor X Condominium',
        direccion: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'gDNYulWWUFT6emR5f1Ff',
        tipo: 'Residencial',
        precio: 500000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreacion: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      },
      {
        id: '1c35984def6517b75c470769cfe41d37db8b405b',
        nombre: 'Thonglor Y Condominium',
        direccion: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'truS4jmwxcf1qREqJYe3',
        tipo: 'Residencial',
        precio: 750000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreacion: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      },
      {
        id: '2d10da5b19c3ac9b4883b4f15cf21ae63ae66e5e',
        nombre: 'Thonglor J Condominium',
        direccion: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'XsMwwZmwvkl4f70a9nPe',
        tipo: 'Residencial',
        precio: 1250000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreacion: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      },
      {
        id: 'bdd8000ab6768333f91f197f6835e02fd076a355',
        nombre: 'Thonglor U Condominium',
        direccion: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'lSiHZbun2P3snZxuFw2U',
        tipo: 'Residencial',
        precio: 600000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreacion: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      },
      {
        id: '1e4095aff3b4fce2a9d9462eec6ec422ab155ab5',
        nombre: 'Thonglor P Condominium',
        direccion: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'Fa2QieWuBAzv5ppWwRkt',
        tipo: 'Residencial',
        precio: 250000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreacion: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      }
    ];
    for (let i = 0; i < properties.length; i++) {
      properties[i].docType = 'property';
      await ctx.stub.putState(properties[i].id, Buffer.from(JSON.stringify(properties[i])));
      console.info('Añadida <--> ', properties[i]);
    }
    console.info('============= FINAL : Inicializar Ledger ===========');
  }

  async queryPropiedad(ctx, propNumber) {
    const propAsBytes = await ctx.stub.getState(propNumber); // obtener la property del chaincode state
    if (!propAsBytes || propAsBytes.length === 0) {
      throw new Error(`${propNumber} no existe`);
    }
    console.log(propAsBytes.toString());
    return propAsBytes.toString();
  }

  async crearPropiedad(ctx, id, nombre, direccion, info, agenteId, propietarioId, tipo, precio, orgId, fechacreacion, anteriorId) {
    console.info('============= INICIO : Crear propiedad ===========');
    const data = {
      docType: 'property',
      id,
      nombre,
      direccion,
      info,
      agenteId,
      propietarioId,
      tipo,
      precio: parseFloat(price),
      orgId,
      fechacreacion,
      anteriorId
    };

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(data)));
    console.info('============= FINAL : Crear Propiedad ===========');
  }

  async queryPropiedades(ctx) {
    const startKey = '';
    const endKey = '';
    const allResults = [];
    for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
      const strValue = Buffer.from(value).toString('utf8');
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push({ Key: key, Record: record });
    }
    console.info(allResults);
    return JSON.stringify(allResults);
  }

  async transferirPropiedad(ctx, propId) {
    console.info('============= INICIO : Transferir propiedad ===========');

     const propAsBytes = await ctx.stub.getState(propId); // get the property from chaincode state
     if (!propAsBytes || propAsBytes.length === 0) {
       throw new Error(`${propId} does not exist`);
     }
     const property = JSON.parse(propAsBytes.toString());
     property.transferredAt = new Date().toISOString();

     await ctx.stub.putState(propId, Buffer.from(JSON.stringify(property)));
     console.info('============= FINAL : Transferir propiedad ===========');
  }
}

module.exports = RealEstate;
