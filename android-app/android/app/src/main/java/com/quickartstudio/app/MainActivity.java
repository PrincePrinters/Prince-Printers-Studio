package com.quickartstudio.app;

import android.app.DownloadManager;
import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView webView = getBridge().getWebView();
        // Website gallery calls window.StudioApp.download(url, filename) inside the app,
        // because normal browser-style (blob) downloads do not work in an Android WebView.
        webView.addJavascriptInterface(new StudioAppBridge(this), "StudioApp");
    }

    static class StudioAppBridge {
        private final Context context;

        StudioAppBridge(Context context) {
            this.context = context.getApplicationContext();
        }

        @JavascriptInterface
        public boolean download(String url, String filename) {
            if (url == null || !url.startsWith("https://")) return false;
            String name = (filename == null ? "photo" : filename).replaceAll("[^a-zA-Z0-9._ -]", "_");
            if (name.isEmpty()) name = "photo";
            try {
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                request.setTitle(name);
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name);
                DownloadManager dm = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
                dm.enqueue(request);
                return true;
            } catch (Exception e) {
                Toast.makeText(context, "Download nahi ho paya", Toast.LENGTH_SHORT).show();
                return false;
            }
        }
    }
}
