from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

engine = create_engine('postgresql://neondb_owner:npg_9NrwIXfgJT6Q@ep-fancy-art-ao98fep1-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb')
Session = sessionmaker(bind=engine)
session = Session()
u_ws = session.execute(text("SELECT workspace_id FROM users WHERE email='admin@xeno.ai'")).scalar()
c_ws = session.execute(text("SELECT workspace_id FROM customers LIMIT 1")).scalar()
print('User WS:', u_ws)
print('Cust WS:', c_ws)
