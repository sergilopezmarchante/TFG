
'use strict';

const { Contract } = require('fabric-contract-api');

class RealEstate extends Contract {
  async initLedger(ctx) {
    console.info('============= INICIO : Iniciar ledger ===========');
    const properties = [
      {
        id: 'a89b661bcf36f786489c61912cf1989ea27a7aed',
        nombre: 'Thonglor X Condominium',
        dirección: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'gDNYulWWUFT6emR5f1Ff',
        tipo: 'Residential',
        precio: 500000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreación: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      },
      {
        id: '1c35984def6517b75c470769cfe41d37db8b405b',
        nombre: 'Thonglor Y Condominium',
        dirección: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'truS4jmwxcf1qREqJYe3',
        tipo: 'Residential',
        precio: 750000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreación: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      },
      {
        id: '2d10da5b19c3ac9b4883b4f15cf21ae63ae66e5e',
        nombre: 'Thonglor J Condominium',
        dirección: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'XsMwwZmwvkl4f70a9nPe',
        tipo: 'Residential',
        precio: 1250000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreación: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      },
      {
        id: 'bdd8000ab6768333f91f197f6835e02fd076a355',
        nombre: 'Thonglor U Condominium',
        dirección: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'lSiHZbun2P3snZxuFw2U',
        tipo: 'Residential',
        precio: 600000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreación: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      },
      {
        id: '1e4095aff3b4fce2a9d9462eec6ec422ab155ab5',
        nombre: 'Thonglor P Condominium',
        dirección: 'Thonglor, Bangkok Thailand',
        info: 'Condominium Acquisition',
        agenteId: 'rHfDz2hI2NopdQJFE2pm',
        propietarioId: 'Fa2QieWuBAzv5ppWwRkt',
        tipo: 'Residential',
        precio: 250000,
        orgId: 'D0QqmWMzXvytFtWtILUU',
        fechacreacion: '2021-04-04T11:30:29.879Z',
        anteriorId: ''
      }
    ];
    for (let i = 0; i < properties.length; i++) {
      properties[i].docType = 'property';
      await ctx.stub.putState(properties[i].id, Buffer.from(JSON.stringify(properties[i])));
      console.info('Added <--> ', properties[i]);
    }
    console.info('============= END : Initialize Ledger ===========');
  }

  async queryProperty(ctx, propNumber) {
    const propAsBytes = await ctx.stub.getState(propNumber); // get the property from chaincode state
    if (!propAsBytes || propAsBytes.length === 0) {
      throw new Error(`${propNumber} does not exist`);
    }
    console.log(propAsBytes.toString());
    return propAsBytes.toString();
  }

  async createProperty(ctx, id, name, address, about, agentId, ownerId, type, price, orgId, createdAt, previousId) {
    console.info('============= START : Create Property ===========');
    const data = {
      docType: 'property',
      id,
      name,
      address,
      about,
      agentId,
      ownerId,
      type,
      price: parseFloat(price),
      orgId,
      createdAt,
      previousId
    };

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(data)));
    console.info('============= END : Create Property ===========');
  }

  async queryAllProperties(ctx) {
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

  // async transferPropOwner(ctx, propId) {
  //   console.info('============= START : Change Property Owner ===========');

  //   const propAsBytes = await ctx.stub.getState(propId); // get the property from chaincode state
  //   if (!propAsBytes || propAsBytes.length === 0) {
  //     throw new Error(`${propId} does not exist`);
  //   }
  //   const property = JSON.parse(propAsBytes.toString());
  //   property.transferredAt = new Date().toISOString();

  //   await ctx.stub.putState(propId, Buffer.from(JSON.stringify(property)));
  //   console.info('============= END : Change Property Owner ===========');
  // }
}

module.exports = RealEstate;
