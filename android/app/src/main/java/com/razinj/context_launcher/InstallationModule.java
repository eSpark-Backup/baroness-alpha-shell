package com.razinj.context_launcher;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

public class InstallationModule extends ReactContextBaseJavaModule {

    private static final String TAG = "InstallationModule";
    private final ReactApplicationContext reactContext;

    public InstallationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "InstallationModule";
    }

    @ReactMethod
    public void installApk(String apkPath, Promise promise) {
        try {
            File apkFile = new File(apkPath);

            Intent intent = new Intent(Intent.ACTION_VIEW);
            Uri apkUri;
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                apkUri = FileProvider.getUriForFile(reactContext, reactContext.getPackageName() + ".fileprovider", apkFile);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                apkUri = Uri.fromFile(apkFile);
            }

            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                boolean hasInstallPermission = reactContext.getPackageManager().canRequestPackageInstalls();
                if (!hasInstallPermission) {
                    promise.reject("PERMISSION_REQUIRED", "Permission required to install packages.");
                    return;
                }
            }

            reactContext.startActivity(intent);

            // Resolve the promise indicating that the installation was initiated
            promise.resolve("Installation initiated successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error installing APK", e);
            promise.reject("INSTALLATION_FAILED", "Failed to install APK: " + e.getMessage());
        }
    }
}

