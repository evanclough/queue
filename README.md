Queue is a youtube queue gated behind CSH account SSO

# Development
To run the application, you must have the latest version of Python 3 and virtualenv installed. Once you have those installed, create a new virtualenv and install the Python dependencies:
## Windows CMD
```
    virtualenv .env
    .\.env\Scripts\activate
    pip install -r requirements.txt
    cd {directory with app.py} 
    flask run
```
 ## Bash 
 ```
    virtualenv .env
    source .env/bin/activate
    pip install -r requirements.txt
    cd {directory with app.py} 
    flask run
 ```