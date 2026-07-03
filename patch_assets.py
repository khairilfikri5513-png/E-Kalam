import re

with open("src/hooks/useAppAssets.ts", "r") as f:
    content = f.read()

new_content = """import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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
        const { data, error } = await supabase
          .from("app_assets")
          .select("asset_key, public_url")
          .in("asset_key", assetKeys);

        const assetMap: Record<string, string> = {};
        
        if (!error && data) {
          data.forEach(item => {
             assetMap[item.asset_key] = item.public_url;
          });
        }
        
        // Let's add fallbacks for avatars via Supabase storage if not in db
        if (!assetMap["muallim_khairil_avatar"] && assetKeys.includes("muallim_khairil_avatar")) {
          const { data: urlData } = supabase.storage.from("e-kalam-assets").getPublicUrl("avatars/muallim_khairil.mp4");
          if (urlData) assetMap["muallim_khairil_avatar"] = urlData.publicUrl;
        }
        if (!assetMap["muallimah_ummi_avatar"] && assetKeys.includes("muallimah_ummi_avatar")) {
          const { data: urlData } = supabase.storage.from("e-kalam-assets").getPublicUrl("avatars/muallimah_ummi.mp4");
          if (urlData) assetMap["muallimah_ummi_avatar"] = urlData.publicUrl;
        }

        appAssetsCache[keysParam] = assetMap;
        setAssets(assetMap);
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
"""

with open("src/hooks/useAppAssets.ts", "w") as f:
    f.write(new_content)
