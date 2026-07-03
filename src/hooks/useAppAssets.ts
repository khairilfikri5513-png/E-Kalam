import { useState, useEffect } from "react";

export interface AppAsset {
  id: string;
  asset_key: string;
  title: string;
  file_path: string;
  public_url: string;
}

const appAssetsCache: Record<string, Record<string, string>> = {};

export function useAppAssets(assetKeys: string[]) {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      const keysParam = assetKeys.join(",");
      if (appAssetsCache[keysParam]) {
        setAssets(appAssetsCache[keysParam]);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/assets?keys=${encodeURIComponent(keysParam)}`);
        if (!response.ok) {
          throw new Error("Gagal memuat turun fail aset.");
        }
        const data = await response.json();
        appAssetsCache[keysParam] = data;
        setAssets(data);
      } catch (err) {
        console.warn("Info fetching app assets:", err);
      } finally {
        setLoading(false);
      }
    }

    if (assetKeys.length > 0) {
      fetchAssets();
    } else {
      setLoading(false);
    }
  }, [assetKeys.join(",")]);

  return { assets, loading };
}
