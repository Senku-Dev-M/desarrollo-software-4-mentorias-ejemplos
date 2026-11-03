"""Pruebas locales reales. No conectan a Supabase ni afirman haberlo hecho."""
import json
import os
import socket
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
checks=[]

def check(name,condition,detail=''):
    checks.append(dict(name=name,passed=bool(condition),detail=detail))
    print(('PASS ' if condition else 'FAIL ')+name,flush=True)
    if not condition: raise AssertionError(name+': '+detail)

def request(port,body):
    req=urllib.request.Request(f'http://127.0.0.1:{port}/products',
        data=json.dumps(body).encode(),headers={'Content-Type':'application/json'},method='POST')
    try:
        with urllib.request.urlopen(req,timeout=5) as response:
            return response.status,response.read().decode()
    except urllib.error.HTTPError as error:
        return error.code,error.read().decode()

def main():
    result=subprocess.run(['dotnet','run','--project','verification/SchemaChecks/SchemaChecks.csproj',
        '--no-launch-profile'],cwd=ROOT,capture_output=True,text=True,encoding='utf-8',errors='replace')
    check('Metadatos EF y SQL coinciden',result.returncode==0,result.stdout+result.stderr)
    for folder,project in [('01-ef','ProductsEf'),('02-sql','ProductsSql')]:
        dll=ROOT/folder/project/'bin/Debug/net10.0'/f'{project}.dll'
        env=dict(os.environ)
        for key in list(env):
            if key.casefold() in ('connectionstrings__supabase','connectionstrings:supabase'):
                env.pop(key)
        env['ConnectionStrings__Supabase']=''
        env['ASPNETCORE_ENVIRONMENT']='Production'
        missing=subprocess.run(['dotnet',str(dll),'--ConnectionStrings:Supabase='],cwd=dll.parent,env=env,capture_output=True,
            text=True,encoding='utf-8',errors='replace',timeout=15,
            creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
        check(f'{project}: error explicito sin conexion',
            missing.returncode!=0 and 'Falta ConnectionStrings:Supabase' in missing.stderr)
        with socket.socket() as sock:
            sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
        # Deliberately unusable dummy: invalid inputs must be rejected without DB I/O.
        env['ConnectionStrings__Supabase']='Host=127.0.0.1;Port=1;Database=unused;Username=unused;Password=unused;Timeout=1'
        log_path=ROOT/'production'/f'{project}-local-test.log'
        with log_path.open('w',encoding='utf-8') as log:
            proc=subprocess.Popen(['dotnet',str(dll),'--urls',f'http://127.0.0.1:{port}'],
                cwd=dll.parent,env=env,stdout=log,stderr=subprocess.STDOUT,
                creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
            try:
                for _ in range(100):
                    if proc.poll() is not None:raise RuntimeError('API exited; inspect '+str(log_path))
                    try:
                        with socket.create_connection(('127.0.0.1',port),timeout=.1):break
                    except OSError:time.sleep(.1)
                else:raise TimeoutError('API did not start')
                cases=[
                    ('nombre vacio',{'name':'  ','price':12.50}),
                    ('nombre ausente',{'price':12.50}),
                    ('nombre largo',{'name':'x'*121,'price':12.50}),
                    ('precio negativo',{'name':'Cuaderno','price':-1}),
                    ('precio fuera de precision',{'name':'Cuaderno','price':100000000}),
                    ('mas de dos decimales',{'name':'Cuaderno','price':12.501}),
                ]
                for label,body in cases:
                    status,payload=request(port,body)
                    check(f'{project}: 400 {label}',status==400 and 'error' in json.loads(payload))
            finally:
                proc.terminate()
                try:proc.wait(timeout=10)
                except subprocess.TimeoutExpired:proc.kill();proc.wait()
    sql_project=ROOT/'02-sql'/'ProductsSql'
    check('Metodo SQL no contiene Migrations',not (sql_project/'Migrations').exists())
    for folder,project in [('01-ef','ProductsEf'),('02-sql','ProductsSql')]:
        source=(ROOT/folder/project/'Program.cs').read_text(encoding='utf-8')
        check(f'{project}: sin creacion automatica de esquema',
              'Database.EnsureCreated(' not in source and 'Database.Migrate(' not in source)
    report=dict(status='LOCAL_CHECKS_PASSED',checks=checks,
        scope='Compilacion, metadatos EF, inicio sin conexion y HTTP 400 reales; sin Supabase.',
        live_supabase_tested=False,project_created=False,migration_applied=False,
        sql_executed=False,post_201_and_get_persistence_tested=False,
        live_screen_recording_performed=False,guided_video_complete=True,
        note='La validacion audiovisual se documenta por separado en validacion-final.json.')
    (ROOT/'outputs'/'validacion.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'{len(checks)} comprobaciones locales correctas; Supabase pendiente.',flush=True)

if __name__=='__main__':main()
