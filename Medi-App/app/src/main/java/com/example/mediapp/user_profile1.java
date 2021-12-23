package com.example.mediapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class user_profile1 extends AppCompatActivity {

    TextView welcomeText;
    Button signOut, editDetail, feedback, mediAI, contactFormButton, insuranceButton;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_profile1);
        mAuth = FirebaseAuth.getInstance();

        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        welcomeText = (TextView)findViewById(R.id.textView6);
        if(user != null){
            welcomeText.setText(String.format("Welcome, %s", user.getEmail()));
        }

        signOut = findViewById(R.id.button5);
        signOut.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Back Button Clicked");

                Intent backToHomeIntent = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(backToHomeIntent);
                FirebaseAuth.getInstance().signOut();
            }
        });

        editDetail = findViewById(R.id.button6);
        editDetail.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Edit Detail Button Clicked");

                Intent editDetailIntent = new Intent(getApplicationContext(), signup2.class);
                startActivity(editDetailIntent);
            }
        });

        feedback = findViewById(R.id.button7);
        feedback.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Feedback Button Clicked");

                Intent feedbackIntent = new Intent(getApplicationContext(), rating.class);
                startActivity(feedbackIntent);
            }
        });

        mediAI = findViewById(R.id.button9);
        mediAI.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Medi-AI Button Clicked");

                Intent mediAiIntent = new Intent(getApplicationContext(), diseaseSelection.class);
                startActivity(mediAiIntent);
            }
        });

        contactFormButton = findViewById(R.id.button10);
        contactFormButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Contact Form Button Clicked");

                Intent contactIntent = new Intent(getApplicationContext(), contactForm.class);
                startActivity(contactIntent);
            }
        });

        insuranceButton = findViewById(R.id.button11);
        insuranceButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Insurance Button Clicked");

                Intent insuranceIntent = new Intent(getApplicationContext(), insurance.class);
                startActivity(insuranceIntent);
            }
        });

    }

    @Override
    public void onStart(){
        super.onStart();
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if(currentUser != null || account != null){
            reload();
        }
    }

    private void reload(){ }
}