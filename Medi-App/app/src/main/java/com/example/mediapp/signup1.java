package com.example.mediapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class signup1 extends AppCompatActivity {

    Button back_button, signup_button;
    private FirebaseAuth mAuth;
    private static final String TAG = "EmailPassword";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup1);
        mAuth = FirebaseAuth.getInstance();

        back_button = findViewById(R.id.button4);
        back_button.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Back Button Clicked");

                Intent backToHomeIntent = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(backToHomeIntent);
            }
        });

        signup_button = findViewById(R.id.button3);
        signup_button.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Login Button Clicked");

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

    private void createAccount(String email, String password){
        mAuth.createUserWithEmailAndPassword(email, password).addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
            @Override
            public void onComplete(@NonNull Task<AuthResult> task) {
                    if(task.isSuccessful()){
                        Log.d(TAG, "createUserWithEmail:success");
                        FirebaseUser user = mAuth.getCurrentUser();
                        updateUI(user);
                    }
                    else{
                        Log.w(TAG, "createUserWithEmail:failure", task.getException());
                        Toast.makeText(signup1.this, "Authentication failed", Toast.LENGTH_SHORT).show();
                        updateUI(null);
                    }
            }
        });
    }

    private void sendVerificationEmail(){
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if(user != null){
            user.sendEmailVerification().addOnCompleteListener(new OnCompleteListener<Void>() {
                @Override
                public void onComplete(@NonNull Task<Void> task) {
                    if(task.isSuccessful()){
                        Log.d(TAG, "Verification Email sent");
                    }
                }
            });
        }
        mAuth.setLanguageCode("en");
    }

    private void reload(){ }

    private void updateUI(FirebaseUser user){ }

}