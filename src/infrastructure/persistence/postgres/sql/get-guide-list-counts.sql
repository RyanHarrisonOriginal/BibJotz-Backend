select 
  count( case when author_id = $1 then id else null end) as myGuides
  , count( case when author_id != $1 then id else null end ) as communityGuides
from app.guides
where author_id = $1 or is_public = true