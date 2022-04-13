export default function KayoSports() {
  this.token = process.env.KAYOSPORTS_TOKEN;
  this.refresh_token = process.env.KAYOSPORTS_REFRESH_TOKEN;
  this.client_id = process.env.KAYOSPORTS_CLIENT_ID;
}
function filterStreams(resp) {
  const validStreams = resp.data[0].alternativeStreams.filter(
    (stream) => stream.manifest.uri.indexOf("foxtel") > -1
  );

  validStreams.forEach(
    (s, index) =>
      (validStreams[index].manifest.uri = s.manifest.uri.replace(
        "https://foxtel-814bffb9b389f652.secure.footprint.net/",
        "https://au01.irumble.com/"
      ))
  );
  resp.data[0].alternativeStreams = validStreams;
  return resp;
}

KayoSports.prototype.fetchNewToken = async function () {
  const url = "https://auth.streamotion.com.au/oauth/token";
  const data = {
    redirect_uri: "https://kayosports.com.au/redirect",
    client_id: this.client_id,
    grant_type: " refresh_token",
    refresh_token: this.refresh_token,
  };
  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const respObj = await resp.json();
  console.log("respObj", respObj);
  if (respObj.hasOwnProperty("access_token")) {
    this.access_token = respObj.access_token;
    this.refresh_token = respObj.refresh_token;
  } else {
    console.error("ERROR no access_token:", respObj);
  }
};

KayoSports.prototype.call = async function (path, data) {
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
  let resp = await this.call(path, data);
  resp = filterStreams(resp);

  console.log("resp", resp);
  return resp;
};
