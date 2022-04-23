export default function KayoSports() {
  this.token = process.env.KAYOSPORTS_TOKEN;
  this.refresh_token = process.env.KAYOSPORTS_REFRESH_TOKEN;
  this.client_id = process.env.KAYOSPORTS_CLIENT_ID;
}
function filterStreams(asset) {
  if (!reassetsp.data) {
    return asset;
  }
  console.log("filtering streams...");
  const validStreams = asset.data[0].alternativeStreams.filter(
    (stream) => stream.manifest.uri.indexOf("foxtel") > -1
  );

  validStreams.forEach(
    (s, index) =>
      (validStreams[index].manifest.uri = s.manifest.uri.replace(
        "https://foxtel-814bffb9b389f652.secure.footprint.net/",
        "https://au01.irumble.com/"
      ))
  );
  asset.data[0].alternativeStreams = validStreams;
  return asset;
}

KayoSports.prototype.fetchNewToken = async function () {
  const url = "https://auth.streamotion.com.au/oauth/token";
  console.log('fetching new token')
  const data = {
    redirect_uri: "https://kayosports.com.au/redirect",
    client_id: this.client_id,
    grant_type: " refresh_token",
    refresh_token: this.refresh_token,
  };
  let headers = {
    "Content-Type": "application/json",
    "referer": "https://kayosports.com.au/",
    "origin": "https://kayosports.com.au"
  }
  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: headers
  });
  const respObj = await resp.json();
  console.log("fetchNewToken respObj", JSON.stringify(respObj));
  if (respObj.hasOwnProperty("access_token")) {
    this.access_token = respObj.access_token;
    this.refresh_token = respObj.refresh_token;
  } else {
    console.error("ERROR no access_token:", respObj);
  }
};

KayoSports.prototype.call = async function (path, data, counter) {
  if(typeof variable === 'undefined') {
    counter = 0;
  }
  let url = `https://play.kayosports.com.au/api/v1/${path}`;
  console.log("fetching :", url);
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${this.token}`,
  };
  console.log("headers", headers);
  const resp = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  console.log('resp status', resp.status);
  if(resp.status == 401){
    counter++;
    if(counter>2){
      console.error('too many requests')
      return {'error': 'too many requests'};
    }
    
    await this.fetchNewToken();

    return await this.call(path, data, counter);
  }
  return await resp.json();
};

KayoSports.prototype.fetchAsset = async function (assetId) {
  let path = `asset/${assetId}/play?fields=alternativeStreams,assetType,markers,metadata.isStreaming,metadata.drmContentIdAvc`;
  let data = {
    device: {
      label: "Chrome Mac OS 10.13.6",
      udid: "158faf02-747e-4c2e-86bc-59c83e8d2a5c",
    },
  };
  let asset = await this.call(path, data);
  
  // asset = filterStreams(asset);

  console.log("asset", JSON.stringify(asset));
  return asset;
};
