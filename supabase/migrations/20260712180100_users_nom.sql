-- Adds an optional display name to public.users (previously only email was
-- shown anywhere in the app). Seeds the known admin account's name per
-- client request.
alter table public.users add column nom text;

update public.users set nom = 'Gabriel Cayer' where email = 'admin@groupereca.ca';
