package com.example.mediapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RatingBar;
import android.widget.Toast;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.protobuf.StringValue;

import java.util.HashMap;
import java.util.Map;

public class rating extends AppCompatActivity {

    FirebaseFirestore db = FirebaseFirestore.getInstance();
    private static final String TAG = "FeedbackDetails";
    private FirebaseAuth mAuth;

    Button sendFeedback;
    RatingBar appRating;
    EditText writtenFeedback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rating);
        mAuth = FirebaseAuth.getInstance();

        sendFeedback = findViewById(R.id.button8);
        sendFeedback.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Update Button Clicked");
                submitInfo();
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

    private void submitInfo() {

        writtenFeedback = (EditText)findViewById(R.id.editTextTextMultiLine);
        appRating = findViewById(R.id.ratingBar);
        float star = appRating.getRating();
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();

        Map<String, Object> feedback = new HashMap<>();
        //feedback.put("stars", star);
        feedback.put("stars", String.valueOf(star));
        feedback.put("description", String.valueOf(writtenFeedback.getText()));

        if (currentUser != null) {
            db.collection("ratings")
                    .document(currentUser.getEmail())
                    .set(feedback)
                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                        @Override
                        public void onSuccess(Void aVoid) {
                            Log.d(TAG, "DocumentSnapshot successfully written!");
                            Toast.makeText(rating.this, "Info Added", Toast.LENGTH_SHORT).show();
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.w(TAG, "Error writing document");
                            Toast.makeText(rating.this, "Info Not Added", Toast.LENGTH_SHORT).show();
                        }
                    });
        }

        Intent backToUserHomepage = new Intent(getApplicationContext(), user_profile1.class);
        startActivity(backToUserHomepage);

    }

    private void reload(){ }

}