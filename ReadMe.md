#FireBase CRUD web
![image](http://www.programwitherik.com/content/images/2015/06/Firebase.png)

[Web google](https://vinosvalencia-bd1ef.firebaseapp.com)
##Table of contents

##Abstract
CRUD example for firebase
create, read, update and delete are the four basic functions of persistent storage.

##Tools
* Jquery
* BootStrap
* HTML5





##Description
What is Firebase?

Firebase is a real time application platform. It allows developers to build rich, collaborative applications quickly using just client-side code. Applications built with Firebase:

Can be built rapidly
Update in realtime out-of-the-box
Remain responsive even when a network connection is unavailable


#Reglas de seguridad con las bases de datos de Firebase

##Firebase Rules

```
{
    "rules": {
        ".read": "auth.uid != null",
        ".write": "auth.uid != null"
    }
}
```

##Try project
On the terminal

`python3 -m http.server`



## Proceso de indexado de datos


```
".indexOn": ["name", "position","number"]
```

## Validación de la esctructura de datos
```
{
    "rules": {
        ".read": "auth.uid != null",
        ".write": "auth.uid != null",
        ".validate":"newData.child('number').isNumber() && newData.hasChildren(['mail','number','position'])"
    }
}
```

## Control de acceso por valor eb bases de datos

```

{
    "rules": {
        ".read": "data.child('Sergio Brito').child('position').val()=='central'",
        ".write": "auth.uid != null",
    }
}
```
## Uso de variables en reglas y procesos de autenticación


# Publish on firebase Google Hosting

Tools: node

# Rules to Storage
```
service firebase.storage {
  match /b/vinosvalencia-bd1ef.appspot.com/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}



```


## Features
### ToDO

- Update to GoogleFirebase (/)
- Upload images to firebase Storage (/)
- Upload archives to Firebase Storage (With class FirebaseFileUploader.js with ES2015)
- Show image on table
