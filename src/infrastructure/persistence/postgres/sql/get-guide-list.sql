with guide_list as (
    SELECT 
        g.id,
        COUNT(gs.id) as numberOfSections,
        COUNT(j.id) as numberOfJourneys,
        COUNT(r.id) as numberOfReflections
    FROM app.guides g
    LEFT JOIN app.guide_versions gv ON g.id = gv.guide_id AND gv.is_current = true
    LEFT JOIN app.users u ON g.author_id = u.id
    LEFT JOIN app.guide_sections gs ON gv.id = gs.guide_version_id
    LEFT JOIN app.journeys j ON gv.id = j.guide_version_id
    LEFT JOIN app.reflections r ON j.id = r.journey_id
    GROUP BY g.id
)

SELECT 
    g.id,
    gv.name,
    gv.description,
    g.is_public as isPublic,
    guide_list.numberOfSections,
    guide_list.numberOfJourneys,
    guide_list.numberOfReflections,
    u.first_name || ' ' || u.last_name as authorName
FROM guide_list
left join app.guides g on guide_list.id = g.id
left join app.guide_versions gv on g.id = gv.guide_id AND gv.is_current = true
left join app.users u on g.author_id = u.id
where g.author_id = $1 or g.is_public = true
order by g.created_at desc
;

