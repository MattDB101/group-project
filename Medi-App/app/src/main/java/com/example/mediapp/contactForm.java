package com.example.mediapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
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
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class contactForm extends AppCompatActivity {

    FirebaseFirestore db = FirebaseFirestore.getInstance();
    private static final String TAG = "ContactFormDetails";
    private FirebaseAuth mAuth;

    Button submitButton, backButton;
    EditText dateText, recipientText, titleText, descriptionText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_form);
        mAuth = FirebaseAuth.getInstance();

        submitButton = findViewById(R.id.button);
        submitButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Submit Button Clicked");
                submitForm();
            }
        });

        backButton = findViewById(R.id.button2);
        backButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Submit Button Clicked");

                Intent backToUserHomepage = new Intent(getApplicationContext(), user_profile1.class);
                startActivity(backToUserHomepage);
            }
        });
    }

    @Override
    public void onStart(){
        super.onStart();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if(currentUser != null){
            reload();
        }
    }

    private void submitForm(){
        dateText = (EditText)findViewById(R.id.editTextDate);
        recipientText = (EditText)findViewById(R.id.editTextTextPersonName);
        titleText = (EditText)findViewById(R.id.editTextTextPersonName2);
        descriptionText = (EditText)findViewById(R.id.editTextTextMultiLine);
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();

        Map<String, Object> contact = new HashMap<>();
        contact.put("date", String.valueOf(dateText.getText()));
        contact.put("recipient", String.valueOf(recipientText.getText()));
        contact.put("title", String.valueOf(titleText.getText()));
        contact.put("description", String.valueOf(descriptionText.getText()));

        if (currentUser != null) {
            db.collection("contacts")
                    .document(currentUser.getEmail())
                    .set(contact)
                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                        @Override
                        public void onSuccess(Void aVoid) {
                            Log.d(TAG, "DocumentSnapshot successfully written!");
                            Toast.makeText(contactForm.this, "Info Added", Toast.LENGTH_SHORT).show();
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.w(TAG, "Error writing document");
                            Toast.makeText(contactForm.this, "Info Not Added", Toast.LENGTH_SHORT).show();
                        }
                    });
        }

        Intent backToUserHomepage = new Intent(getApplicationContext(), user_profile1.class);
        startActivity(backToUserHomepage);
    }

    private void reload(){}
}