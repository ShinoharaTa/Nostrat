<script lang="ts">
  import { createProfile, sendToRelayList } from "$lib/app";
  import { generatePrivateKey, getPublicKey, nip19 } from "nostr-tools";

  let error = false;
  let secretKey: string | null = null;
  const profile = {
    name: "",
    username: "",
    display_name: "",
    displayName: "",
    picture: "",
    banner: "",
    website: "",
    about: "",
  };
  const generateAccount = async () => {
    profile.name = profile.username;
    profile.display_name = profile.displayName;
    const pvKey = generatePrivateKey();
    secretKey = nip19.nsecEncode(pvKey);
    const pubKey = getPublicKey(pvKey);
    // const npub = npubEncode(pubKey);
    const npub = nip19.npubEncode(pubKey);
    console.log(npub);
    const result = await createProfile(profile, pvKey);
    await sendToRelayList(pvKey);
    console.log(result);
  };
</script>

<div class="page">
  <div class="px-4 pt-5">
    <div class="d-grid">
      <div class="text-center mb-4">
        <!-- <img src="/image/nostxlogo.svg" class="img-fluid w-75" alt="" /> -->
        <!-- <div class="fs-4"></div> -->
        <div class="fs-1">はじめよう！ Nostr</div>
      </div>
      <!-- <label for="exampleInputEmail1" class="form-label">username</label> -->
      <!-- <div class="mb-2">
        <div class="banner">
          {#if profile.banner}
            <img src={profile.banner} class="img-fluid w-100" alt="" />
          {:else}
            <div class="">no image</div>
          {/if}
        </div>
      </div> -->
      <div class="d-flex mb-2">
        <!-- {#if profile.picture}
          <div class="icon">
            <img src={profile.picture} class="" alt="" />
          </div>
        {:else}
          <div class="icon">no<br />image</div>
        {/if} -->
        <div class="flex-fill">
          <div class="input-group mb-2">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input
              type="text"
              class="form-control"
              placeholder="ユーザー名"
              bind:value={profile.username}
            />
          </div>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="表示名"
              bind:value={profile.displayName}
            />
          </div>
        </div>
      </div>
      <div class="input-group mb-2">
        <input
          type="text"
          class="form-control"
          placeholder="Webサイト"
          bind:value={profile.website}
        />
      </div>
      <div class="input-group mb-2">
        <textarea
          class="form-control"
          placeholder="自己紹介"
          bind:value={profile.about}
          rows="5"
        />
      </div>
      <!-- <div class="mt-3"><input type="text" class="form-control" /></div> -->
      <!-- <div class="mt-5 text-center">クライアントを選択</div> -->
      <!-- <ClientSelect bind:select={config.client} /> -->
    </div>
    <div class="mt-3">※ すべて、あとで変更できます</div>
    <div class="text-center mt-4">
      <div class="mt-4">
        <button class="btn btn-lg bg-brand px-4" on:click={generateAccount}>
          アカウントを作る
        </button>
      </div>
    </div>

    <div class="mt-5">
      <div class="form-label">秘密の鍵（絶対に流出禁止）</div>
      <div class="form-label text-danger">※ 再発行できません</div>
      <div class="form-label text-danger">※ 変更できません</div>
      <textarea
        bind:value={secretKey}
        rows="3"
        class="form-control mt-3"
        disabled
      />
    </div>
  </div>
</div>

<style>
  .banner {
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 3;
  }

  .icon {
    /* width: 20%; */
    height: 100%;
    background-color: #eee;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
</style>
