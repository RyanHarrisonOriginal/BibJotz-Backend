select 
  count( case when created_by = $1 then id else null end) as myGuides
  , count( case when created_by != $1 then id else null end ) as communityGuides
from app.guides
where created_by = $1 or is_public = true