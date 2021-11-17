package com.example.mediapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class signup2 extends AppCompatActivity {

    FirebaseFirestore db = FirebaseFirestore.getInstance();
    private static final String TAG = "PersonalDetails";
    //private FirebaseAuth mAuth;

    Button nextButton;
    EditText fname, lname, tel, add1, add2, city, region, zip, country;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup2);
        //mAuth = FirebaseAuth.getInstance();
        //FirebaseUser currentUser = mAuth.getCurrentUser();

        nextButton = findViewById(R.id.button);
        nextButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Sign Up Button Clicked");
                addUser();
            }
        });
    }

    /*@Override
    public void onStart(){
        super.onStart();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if(currentUser != null){
            reload();
        }
    }*/

    private void addUser(){

        fname = (EditText)findViewById(R.id.editTextTextPersonName);
        lname = (EditText)findViewById(R.id.editTextTextPersonName2);
        tel = (EditText)findViewById(R.id.editTextTextPersonName1);
        add1 = (EditText)findViewById(R.id.editTextTextPersonName4);
        add2 = (EditText)findViewById(R.id.editTextTextPersonName5);
        city = (EditText)findViewById(R.id.editTextTextPersonName6);
        region = (EditText)findViewById(R.id.editTextTextPersonName7);
        zip = (EditText)findViewById(R.id.editTextTextPersonName8);
        country = (EditText)findViewById(R.id.editTextTextPersonName9);

        Map<String, Object> user = new HashMap<>();
        user.put("fname", fname.getText().toString());
        user.put("lname", lname.getText().toString());
        user.put("tel", tel.getText().toString());
        user.put("add1", add1.getText().toString());

        if(!add2.getText().toString().equals("")){
            user.put("add2", add2.getText().toString());
        }

        user.put("city", city.getText().toString());
        user.put("region", region.getText().toString());
        user.put("zip", zip.getText().toString());
        user.put("country", country.getText().toString());
        //user.put("email", Objects.requireNonNull(currentUser).getEmail());

        db.collection("patient")
                .add(user)
                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                    @Override
                    public void onSuccess(DocumentReference documentReference) {
                        Log.d(TAG, "DocumentSnapshot added with ID: " + documentReference.getId());
                        Toast.makeText(signup2.this, "Info Added", Toast.LENGTH_SHORT).show();
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.w(TAG, "Error adding document", e);
                        Toast.makeText(signup2.this, "Info Not Added", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void reload(){ }

}