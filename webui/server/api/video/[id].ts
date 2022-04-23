import KayoSports from "~~/lib/kayosports";
export default defineEventHandler(async event => {
  const assetId = event.context.params.id;
  const kayosports = new KayoSports();
  const asset = await kayosports.fetchAsset(assetId);
  return asset;  
});