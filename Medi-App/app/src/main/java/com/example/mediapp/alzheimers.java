package com.example.mediapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.mediapp.ml.ModelAlzheimerV3;
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

public class alzheimers extends AppCompatActivity {

    Button predictButton;
    EditText gender, age, education, ses, mmse, cdr, etiv, nwbv;
    TextView showResult;
    FirebaseFirestore db = FirebaseFirestore.getInstance();
    private FirebaseAuth mAuth;
    private static final String TAG = "AlzheimersPrediction";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_alzheimers);
        showResult = findViewById(R.id.textView12);
        mAuth = FirebaseAuth.getInstance();

        predictButton = findViewById(R.id.button);
        predictButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Predict Button Clicked");
                String prediction = test(alzheimers.this);
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

        gender = (EditText)findViewById(R.id.editTextTextPersonName);
        age = (EditText)findViewById(R.id.editTextTextPersonName2);
        education = (EditText)findViewById(R.id.editTextTextPersonName3);
        ses = (EditText)findViewById(R.id.editTextTextPersonName4);
        mmse = (EditText)findViewById(R.id.editTextTextPersonName5);
        cdr = (EditText)findViewById(R.id.editTextTextPersonName6);
        etiv = (EditText)findViewById(R.id.editTextTextPersonName7);
        nwbv = (EditText)findViewById(R.id.editTextTextPersonName8);;

        Map<String, Object> info = new HashMap<>();
        info.put("mF", Integer.parseInt(gender.getText().toString()));
        info.put("age", Integer.parseInt(age.getText().toString()));
        info.put("educ", Integer.parseInt(education.getText().toString()));
        info.put("ses", Integer.parseInt(ses.getText().toString()));
        info.put("mmse", Integer.parseInt(mmse.getText().toString()));
        info.put("cdr", Float.parseFloat(cdr.getText().toString()));
        info.put("etiv", Integer.parseInt(etiv.getText().toString()));
        info.put("nwbv", Float.parseFloat(nwbv.getText().toString()));
        info.put("asf", predictionResult);

        if (currentUser != null) {
            db.collection("patient")
                    .document(currentUser.getEmail())
                    .collection("diseases")
                    .document("alzheimers")
                    .set(info, SetOptions.merge())
                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                        @Override
                        public void onSuccess(Void aVoid) {
                            Log.d(TAG, "DocumentSnapshot successfully written!");
                            Toast.makeText(alzheimers.this, "Info Added", Toast.LENGTH_SHORT).show();
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.w(TAG, "Error writing document");
                            Toast.makeText(alzheimers.this, "Info Not Added", Toast.LENGTH_SHORT).show();
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
            ModelAlzheimerV3 model = ModelAlzheimerV3.newInstance(context);

            gender = (EditText)findViewById(R.id.editTextTextPersonName);
            age = (EditText)findViewById(R.id.editTextTextPersonName2);
            education = (EditText)findViewById(R.id.editTextTextPersonName3);
            ses = (EditText)findViewById(R.id.editTextTextPersonName4);
            mmse = (EditText)findViewById(R.id.editTextTextPersonName5);
            cdr = (EditText)findViewById(R.id.editTextTextPersonName6);
            etiv = (EditText)findViewById(R.id.editTextTextPersonName7);
            nwbv = (EditText)findViewById(R.id.editTextTextPersonName8);;

            TensorBuffer inputFeature0 = TensorBuffer.createFixedSize(new int[]{1, 8}, DataType.FLOAT32);
            ByteBuffer buff = ByteBuffer.allocate(8 * 4);
            buff.putFloat(Float.parseFloat(gender.getText().toString()));
            buff.putFloat(Float.parseFloat(age.getText().toString()));
            buff.putFloat(Float.parseFloat(education.getText().toString()));
            buff.putFloat(Float.parseFloat(ses.getText().toString()));
            buff.putFloat(Float.parseFloat(mmse.getText().toString()));
            buff.putFloat(Float.parseFloat(cdr.getText().toString()));
            buff.putFloat(Float.parseFloat(etiv.getText().toString()));
            buff.putFloat(Float.parseFloat(nwbv.getText().toString()));
            inputFeature0.loadBuffer(buff);

            ModelAlzheimerV3.Outputs outputs = model.process(inputFeature0);
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
