package com.example.mediapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class diseaseSelection extends AppCompatActivity {

    Button heartDiseaseButton, diabetesButton, alzheimersButton, backButton;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_disease_selection);
        mAuth = FirebaseAuth.getInstance();

        heartDiseaseButton = findViewById(R.id.button);
        heartDiseaseButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Heart Disease Button Clicked");

                Intent backToHomeIntent = new Intent(getApplicationContext(), heart_disease.class);
                startActivity(backToHomeIntent);
            }
        });

        diabetesButton = findViewById(R.id.button2);
        diabetesButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Diabetes Button Clicked");

                Intent backToHomeIntent = new Intent(getApplicationContext(), diabetes.class);
                startActivity(backToHomeIntent);
            }
        });

        alzheimersButton = findViewById(R.id.button3);
        alzheimersButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Alzheimer's Button Clicked");

                Intent backToHomeIntent = new Intent(getApplicationContext(), alzheimers.class);
                startActivity(backToHomeIntent);
            }
        });

        backButton = findViewById(R.id.button4);
        backButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Back Button Clicked");

                Intent backToHomeIntent = new Intent(getApplicationContext(), user_profile1.class);
                startActivity(backToHomeIntent);
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

    private void reload(){ }
}