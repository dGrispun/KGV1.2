-- Add season column to mk_points table
ALTER TABLE mk_points ADD COLUMN season INTEGER;

-- Add index for better query performance
CREATE INDEX idx_mk_points_season ON mk_points(season);

-- Update the RLS policy to include season in the user access control
DROP POLICY IF EXISTS "Users can manage their own MK points" ON mk_points;

CREATE POLICY "Users can manage their own MK points" ON mk_points
    FOR ALL USING (auth.uid() = user_id);
