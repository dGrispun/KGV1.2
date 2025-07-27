-- Add unique constraint including season to mk_points table
-- First, drop the existing unique constraint if it exists
ALTER TABLE mk_points DROP CONSTRAINT IF EXISTS mk_points_user_id_day_item_name_key;

-- Add new unique constraint that includes season
ALTER TABLE mk_points ADD CONSTRAINT mk_points_user_id_day_item_name_season_key 
    UNIQUE (user_id, day, item_name, season);
