-- Run this in Supabase SQL Editor to improve video query performance

CREATE INDEX IF NOT EXISTS idx_unit_videos_unit_status_uploaded 
ON unit_videos (unit_id, status, uploaded_at DESC);

-- Note: user_avatars and avatar_videos were mentioned in the prompt,
-- but the actual table is app_assets for avatars in this project.
CREATE INDEX IF NOT EXISTS idx_app_assets_asset_key 
ON app_assets (asset_key);
