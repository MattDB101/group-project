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
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class insurance extends AppCompatActivity {

    FirebaseFirestore db = FirebaseFirestore.getInstance();
    private static final String TAG = "InsuranceDetails";
    private FirebaseAuth mAuth;

    Button addButton, backButton;
    EditText companyName, insuranceNumber, commencementDate;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_insurance);
        mAuth = FirebaseAuth.getInstance();

        addButton = findViewById(R.id.button);
        addButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Submit Button Clicked");
                addInsurance();
            }
        });

        backButton = findViewById(R.id.button2);
        backButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Back Button Clicked");

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

    private void addInsurance() {
        companyName = (EditText)findViewById(R.id.editTextTextPersonName);
        insuranceNumber = (EditText)findViewById(R.id.editTextTextPersonName2);
        commencementDate = (EditText)findViewById(R.id.editTextDate2);
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();

        Map<String, Object> contact = new HashMap<>();
        contact.put("companyName", String.valueOf(companyName.getText()));
        contact.put("insuranceNumber", String.valueOf(insuranceNumber.getText()));
        contact.put("commencementDate", String.valueOf(commencementDate.getText()));

        if (currentUser != null) {
            db.collection("insurances")
                    .add(contact)
                    .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                        @Override
                        public void onSuccess(DocumentReference documentReference) {
                            Log.d(TAG, "DocumentSnapshot successfully written!" + documentReference.getId());
                            Toast.makeText(insurance.this, "Info Added", Toast.LENGTH_SHORT).show();
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.w(TAG, "Error writing document");
                            Toast.makeText(insurance.this, "Info Not Added", Toast.LENGTH_SHORT).show();
                        }
                    });
        }

        Intent backToUserHomepage = new Intent(getApplicationContext(), user_profile1.class);
        startActivity(backToUserHomepage);

    }

    private void reload(){}
}