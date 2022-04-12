export default function KayoSports(){
    this.token = process.env.KAYOSPORTS_TOKEN;
    
}
KayoSports.prototype.call = async function(path, data){
    let url = `https://play.kayosports.com.au/api/v1/${path}`;
    console.log('fetching :', url);
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
    };
    // console.log("headers", headers)
    const resp = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    return await resp.json();
}

KayoSports.prototype.fetchAsset = async function(assetId){
  let path = `asset/${assetId}/play?fields=alternativeStreams,assetType,markers,metadata.isStreaming,metadata.drmContentIdAvc`;
  let data = {
    "device": {
      "label":"Chrome Mac OS 10.13.6",
      "udid":"158faf02-747e-4c2e-86bc-59c83e8d2a5c"
    }
  };
  return await this.call(path, data);
}