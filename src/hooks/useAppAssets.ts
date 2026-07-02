import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface AppAsset {
  id: string;
  asset_key: string;
  title: string;
  file_path: string;
  public_url: string;
}

export function useAppAssets(assetKeys: string[]) {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const { data, error } = await supabase
          .from("app_assets")
          .select("asset_key, public_url")
          .in("asset_key", assetKeys);

        if (error) throw error;

        if (data) {
          const assetMap: Record<string, string> = {};
          data.forEach((asset) => {
            if (asset.public_url) {
              assetMap[asset.asset_key] = asset.public_url;
            }
          });
          setAssets(assetMap);
        }
      } catch (err) {
        console.warn("Info fetching app assets:", err);
      } finally {
        setLoading(false);
      }
    }

    if (assetKeys.length > 0 && import.meta.env.VITE_SUPABASE_URL) {
      fetchAssets();
    } else {
      setLoading(false);
    }
  }, [assetKeys.join(",")]);

  return { assets, loading };
}
