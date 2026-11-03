-- Solo lectura. Ejecutar después de completar ambos métodos.
select version();

select table_name, column_name, data_type, character_maximum_length,
       numeric_precision, numeric_scale, is_nullable, is_identity,
       identity_generation
from information_schema.columns
where table_schema = 'public'
  and table_name in ('products_ef', 'products_sql')
order by table_name, ordinal_position;

select relname, relrowsecurity
from pg_class
where oid in ('public.products_ef'::regclass, 'public.products_sql'::regclass);

select * from public.products_ef order by id;
select * from public.products_sql order by id;
