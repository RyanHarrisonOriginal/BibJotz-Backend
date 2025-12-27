with guide_list as (
    SELECT 
        g.id,
        COUNT(gs.id) as numberOfSections,
        COUNT(j.id) as numberOfJourneys,
        COUNT(r.id) as numberOfReflections
    FROM app.guides g
    LEFT JOIN app.users u ON g.created_by = u.id
    LEFT JOIN app.guide_sections gs ON g.id = gs.guide_Id
    LEFT JOIN app.journeys j ON g.id = j.guide_Id
    LEFT JOIN app.reflections r ON j.id = r.journey_Id
    GROUP BY g.id
)

SELECT 
    g.name,
    g.description,
    g.is_public as isPublic,
    guide_list.numberOfSections,
    guide_list.numberOfJourneys,
    guide_list.numberOfReflections,
    u.first_name || ' ' || u.last_name as authorName
FROM guide_list
left join app.guides g on guide_list.id = g.id
left join app.users u on g.created_by = u.id
order by g.created_at desc
;

