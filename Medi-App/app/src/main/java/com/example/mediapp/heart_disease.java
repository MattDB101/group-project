package com.example.mediapp;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.mediapp.ml.ModelHeartV3;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;

import org.tensorflow.lite.DataType;
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;


public class heart_disease extends AppCompatActivity {

    Button predictButton;
    EditText age, gender, chestPain, bloodPressure, serumCholestrol, fastingBloodSugar, restingECG, maxHeartRate, exerciseAngina, stDepression, peakExercise, numberVessel, thal;
    TextView showResult;
    FirebaseFirestore db = FirebaseFirestore.getInstance();
    private FirebaseAuth mAuth;
    private static final String TAG = "HeartDiseasePrediction";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_heart_disease);
        showResult = findViewById(R.id.textView15);
        mAuth = FirebaseAuth.getInstance();

        predictButton = findViewById(R.id.button);
        predictButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Predict Button Clicked");
                String prediction = test(heart_disease.this);
                float newNumber = Float.parseFloat(prediction.substring(1, prediction.length() - 1));
                int number = Math.round(newNumber);
                Log.d("Number", String.valueOf(number));
                showResult.setText(Integer.toString(number));
                updateData(number);
            }
        });
    }

    private void updateData(Integer predictionResult) {
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();

        age = findViewById(R.id.editTextTextPersonName);
        gender = findViewById(R.id.editTextTextPersonName2);
        chestPain = findViewById(R.id.editTextTextPersonName11);
        bloodPressure = findViewById(R.id.editTextTextPersonName12);
        serumCholestrol = findViewById(R.id.editTextTextPersonName13);
        fastingBloodSugar = findViewById(R.id.editTextTextPersonName15);
        restingECG = findViewById(R.id.editTextTextPersonName16);
        maxHeartRate = findViewById(R.id.editTextTextPersonName17);
        exerciseAngina = findViewById(R.id.editTextTextPersonName18);
        stDepression = findViewById(R.id.editTextTextPersonName19);
        peakExercise = findViewById(R.id.editTextTextPersonName20);
        numberVessel = findViewById(R.id.editTextTextPersonName21);
        thal = findViewById(R.id.editTextTextPersonName22);

        Map<String, Object> info = new HashMap<>();
        info.put("age", Integer.parseInt(age.getText().toString()));
        info.put("sex", Integer.parseInt(gender.getText().toString()));
        info.put("cp", Integer.parseInt(chestPain.getText().toString()));
        info.put("trestbps", Integer.parseInt(bloodPressure.getText().toString()));
        info.put("chol", Integer.parseInt(serumCholestrol.getText().toString()));
        info.put("fbs", Integer.parseInt(fastingBloodSugar.getText().toString()));
        info.put("restecg", Integer.parseInt(restingECG.getText().toString()));
        info.put("thalach", Integer.parseInt(maxHeartRate.getText().toString()));
        info.put("exang", Integer.parseInt(exerciseAngina.getText().toString()));
        info.put("oldpeak", Float.parseFloat(stDepression.getText().toString()));
        info.put("slope", Integer.parseInt(peakExercise.getText().toString()));
        info.put("ca", Integer.parseInt(numberVessel.getText().toString()));
        info.put("thal", Integer.parseInt(thal.getText().toString()));
        info.put("target", predictionResult);

        if (currentUser != null) {
            db.collection("patient")
                    .document(currentUser.getEmail())
                    .collection("diseases")
                    .document("heart disease")
                    .set(info, SetOptions.merge())
                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                        @Override
                        public void onSuccess(Void aVoid) {
                            Log.d(TAG, "DocumentSnapshot successfully written!");
                            Toast.makeText(heart_disease.this, "Info Added", Toast.LENGTH_SHORT).show();
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.w(TAG, "Error writing document");
                            Toast.makeText(heart_disease.this, "Info Not Added", Toast.LENGTH_SHORT).show();
                        }
                    });
        }
    }

    @Override
    public void onStart(){
        super.onStart();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if(currentUser != null){
            reload();
        }
    }

    public String test(Context context){
        try{
            ModelHeartV3 model = ModelHeartV3.newInstance(context);

            age = findViewById(R.id.editTextTextPersonName);
            gender = findViewById(R.id.editTextTextPersonName2);
            chestPain = findViewById(R.id.editTextTextPersonName11);
            bloodPressure = findViewById(R.id.editTextTextPersonName12);
            serumCholestrol = findViewById(R.id.editTextTextPersonName13);
            fastingBloodSugar = findViewById(R.id.editTextTextPersonName15);
            restingECG = findViewById(R.id.editTextTextPersonName16);
            maxHeartRate = findViewById(R.id.editTextTextPersonName17);
            exerciseAngina = findViewById(R.id.editTextTextPersonName18);
            stDepression = findViewById(R.id.editTextTextPersonName19);
            peakExercise = findViewById(R.id.editTextTextPersonName20);
            numberVessel = findViewById(R.id.editTextTextPersonName21);
            thal = findViewById(R.id.editTextTextPersonName22);

            TensorBuffer inputFeature0 = TensorBuffer.createFixedSize(new int[]{1, 13}, DataType.FLOAT32);
            ByteBuffer buff = ByteBuffer.allocate(13 * 4);
            buff.putFloat(Float.parseFloat(age.getText().toString()));
            buff.putFloat(Float.parseFloat(gender.getText().toString()));
            buff.putFloat(Float.parseFloat(chestPain.getText().toString()));
            buff.putFloat(Float.parseFloat(bloodPressure.getText().toString()));
            buff.putFloat(Float.parseFloat(serumCholestrol.getText().toString()));
            buff.putFloat(Float.parseFloat(fastingBloodSugar.getText().toString()));
            buff.putFloat(Float.parseFloat(restingECG.getText().toString()));
            buff.putFloat(Float.parseFloat(maxHeartRate.getText().toString()));
            buff.putFloat(Float.parseFloat(exerciseAngina.getText().toString()));
            buff.putFloat(Float.parseFloat(stDepression.getText().toString()));
            buff.putFloat(Float.parseFloat(peakExercise.getText().toString()));
            buff.putFloat(Float.parseFloat(numberVessel.getText().toString()));
            buff.putFloat(Float.parseFloat(thal.getText().toString()));
            inputFeature0.loadBuffer(buff);

            ModelHeartV3.Outputs outputs = model.process(inputFeature0);
            TensorBuffer outputFeature0 = outputs.getOutputFeature0AsTensorBuffer();


            String result = Arrays.toString(outputFeature0.getFloatArray());
            model.close();
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "result";
    }

    private void reload(){ }
}