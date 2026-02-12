with journey_base as (
    select
        j.id,
        j.name as title,
        j.guide_version_id,
        j.owner_id,
        j.created_at
    from app.journeys j
    where ($1::int is null or j.owner_id = $1)
),

guide_info as (
    select
        gv.id as guide_version_id,
        gv.guide_id,
        gv.name as guide_title
    from app.guide_versions gv
),

sections_agg as (
    select
        gs.guide_version_id,
        jsonb_agg(
            jsonb_build_object(
                'id', gs.id,
                'title', gs.title
            )
        ) filter (where gs.id is not null) as sections
    from app.guide_sections gs
    group by gs.guide_version_id
),

reflections_agg as (
    select
        refl.journey_id,
        json_agg(
            distinct jsonb_build_object(
                'id', refl.id,
                'content', refl.content,
                'sectionTitle', refl_sect.title,
                'createdAt', refl.created_at
            )
        ) filter (where refl.id is not null) as reflections
    from app.reflections refl
    left join app.guide_sections refl_sect
        on refl.guide_section_id = refl_sect.id
    group by refl.journey_id
)

select
    jb.id,
    jb.title,

    gi.guide_version_id,
    gi.guide_id,
    gi.guide_title,

    coalesce(sa.sections, '[]') as sections,
    coalesce(ra.reflections, '[]') as reflections

from journey_base jb

left join guide_info gi
    on jb.guide_version_id = gi.guide_version_id

left join sections_agg sa
    on gi.guide_version_id = sa.guide_version_id

left join reflections_agg ra
    on jb.id = ra.journey_id

order by jb.created_at desc;